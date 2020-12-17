/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import { HIGHLIGHT_LAYER_ATTR, HIGHLIGHT_PAGE_ATTR } from './constants';
import getRectFromOffsets from './getRectFromOffsets';
import getTextFromOffsets from './getTextFromOffsets';
import { NO_SELECTION_STATE, SELECTING_STATE, SelectedState } from './SelectionState';
import StoreProps from './StoreProps';
import { transformArea } from './transformArea';
import HighlightArea from './types/HighlightArea';
import SelectionData from './types/SelectionData';
import SelectionRange from './types/SelectionRange';
import useRotation from './useRotation';

const Tracker: React.FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const { rotation } = useRotation(store);
    const pagesRef = React.useRef<HTMLElement | null>(null);
    const [arePagesFound, setPagesFound] = React.useState(false);

    const handlePagesContainer = (getPagesContainer: () => HTMLElement) => {
        const ele = getPagesContainer();
        pagesRef.current = ele;
        setPagesFound(!!ele);
    };

    const onMouseUpHandler = () => {
        // Get the current selection
        const selection = document.getSelection();

        const selectionState = store.get('selectionState');
        const hasSelection = (selectionState === NO_SELECTION_STATE || selectionState === SELECTING_STATE) &&
                            selection.rangeCount > 0 && selection.toString() !== '';
        if (!hasSelection) {
            return;
        }

        const range = selection.getRangeAt(0);
        const startDiv = range.startContainer.parentNode;
        const parentEndContainer = range.endContainer.parentNode;
        const shouldIgnoreEndContainer = (parentEndContainer instanceof HTMLElement) && parentEndContainer.hasAttribute(HIGHLIGHT_LAYER_ATTR);

        let endDiv: Node, endOffset: number;
        if (shouldIgnoreEndContainer && range.endOffset == 0) {
            endDiv = range.endContainer.previousSibling;
            endOffset = endDiv.textContent.length;
        } else if (shouldIgnoreEndContainer) {
            endDiv = range.endContainer;
            endOffset = range.endOffset;
        } else {
            endDiv = parentEndContainer;
            endOffset = range.endOffset;
        }

        if (!(startDiv instanceof HTMLElement) || !(endDiv instanceof HTMLElement)) {
            return;
        }

        const startPageIdx = parseInt(startDiv.getAttribute(HIGHLIGHT_PAGE_ATTR), 10);
        const endPageIdx = parseInt(endDiv.getAttribute(HIGHLIGHT_PAGE_ATTR), 10);

        const startTextLayer = startDiv.parentElement;
        const endTextLayer = endDiv.parentElement;

        const startPageRect = startTextLayer.getBoundingClientRect();
        const startDivSiblings: HTMLElement[] = [].slice.call(startTextLayer.querySelectorAll(`[${HIGHLIGHT_PAGE_ATTR}]`));
        const startDivIdx = startDivSiblings.indexOf(startDiv);

        const endPageRect = endTextLayer.getBoundingClientRect();
        const endDivSiblings: HTMLElement[] = [].slice.call(endTextLayer.querySelectorAll(`[${HIGHLIGHT_PAGE_ATTR}]`));
        const endDivIdx = endDivSiblings.indexOf(endDiv);

        let rangeType: SelectionRange = SelectionRange.DifferentPages; 
        switch (true) {
            case (startPageIdx === endPageIdx && startDivIdx === endDivIdx):
                rangeType = SelectionRange.SameDiv;
                break;
            case (startPageIdx === endPageIdx && startDivIdx < endDivIdx):
                rangeType = SelectionRange.DifferentDivs;
                break;
            default:
                rangeType = SelectionRange.DifferentPages;
                break;
        }

        const getRectBetween = (min: number, max: number, eleArray: HTMLElement[]) => Array(max - min + 1).fill(0)
            .map((_, i) => eleArray[min + i].getBoundingClientRect());

        let highlightAreas: HighlightArea[] = [];
        switch (rangeType) {
            case SelectionRange.SameDiv:
                // eslint-disable-next-line no-case-declarations
                const rect = getRectFromOffsets(startDiv, range.startOffset, endOffset);
                highlightAreas = [{
                    height: rect.height * 100 / startPageRect.height,
                    left: (rect.left - startPageRect.left) * 100 / startPageRect.width,
                    pageIndex: startPageIdx,
                    top: (rect.top - startPageRect.top) * 100 / startPageRect.height,
                    width: rect.width * 100 / startPageRect.width,
                }];
                break;

            case SelectionRange.DifferentDivs:
                highlightAreas = [getRectFromOffsets(startDiv, range.startOffset, startDiv.textContent.length)]
                    .concat(getRectBetween(startDivIdx + 1, endDivIdx - 1, startDivSiblings))
                    .concat([getRectFromOffsets(endDiv, 0, endOffset)])
                    .map(rect => {
                        return {
                            height: rect.height * 100 / startPageRect.height,
                            left: (rect.left - startPageRect.left) * 100 / startPageRect.width,
                            pageIndex: startPageIdx,
                            top: (rect.top - startPageRect.top) * 100 / startPageRect.height,
                            width: rect.width * 100 / startPageRect.width,
                        };
                    });
                break;

            case SelectionRange.DifferentPages:
                // eslint-disable-next-line no-case-declarations
                const startAreas = [getRectFromOffsets(startDiv, range.startOffset, startDiv.textContent.length)]
                    .concat(getRectBetween(startDivIdx + 1, startDivSiblings.length - 1, startDivSiblings))
                    .map(rect => {
                        return {
                            height: rect.height * 100 / startPageRect.height,
                            left: (rect.left - startPageRect.left) * 100 / startPageRect.width,
                            pageIndex: startPageIdx,
                            top: (rect.top - startPageRect.top) * 100 / startPageRect.height,
                            width: rect.width * 100 / startPageRect.width,
                        };
                    });
                // eslint-disable-next-line no-case-declarations
                const endAreas = getRectBetween(0, endDivIdx - 1, endDivSiblings)
                    .concat([getRectFromOffsets(endDiv, 0, endOffset)])
                    .map(rect => {
                        return {
                            height: rect.height * 100 / endPageRect.height,
                            left: (rect.left - endPageRect.left) * 100 / endPageRect.width,
                            pageIndex: endPageIdx,
                            top: (rect.top - endPageRect.top) * 100 / endPageRect.height,
                            width: rect.width * 100 / endPageRect.width,
                        };
                    });
                highlightAreas = startAreas.concat(endAreas);
                break;
        }

        // Determine the selected text
        let selectedText = '';
        switch (rangeType) {
            case SelectionRange.SameDiv:
                selectedText = getTextFromOffsets(startTextLayer, startDivIdx, range.startOffset, startDivIdx, endOffset);
                break;

            case SelectionRange.DifferentDivs:
                selectedText = getTextFromOffsets(startTextLayer, startDivIdx, range.startOffset, endDivIdx, endOffset);
                break;

            case SelectionRange.DifferentPages:
                // eslint-disable-next-line no-case-declarations
                const startText = getTextFromOffsets(startTextLayer, startDivIdx, range.startOffset, startDivSiblings.length);
                
                // eslint-disable-next-line no-case-declarations
                const endText = getTextFromOffsets(endTextLayer, 0, 0, endDivIdx, endOffset);
                
                selectedText = `${startText}\n${endText}`;
                break;
        }

        let selectionRegion: HighlightArea;
        if (highlightAreas.length > 0) {
            selectionRegion = highlightAreas[highlightAreas.length - 1];
        } else {
            const endDivRect = endDiv.getBoundingClientRect();
            selectionRegion = {
                height: endDivRect.height * 100 / endPageRect.height,
                left: (endDivRect.left - endPageRect.left) * 100 / endPageRect.width,
                pageIndex: endPageIdx,
                top: (endDivRect.top - endPageRect.top) * 100 / endPageRect.height,
                width: endDivRect.width * 100 / endPageRect.width,
            };
        }

        const selectionData: SelectionData = {
            startPageIndex: startPageIdx - 1,
            endPageIndex: endPageIdx - 1,
            startOffset: range.startOffset,
            startDivIndex: startDivIdx,
            endOffset,
            endDivIndex: endDivIdx
        };

        store.update('selectionState', new SelectedState(
            selectedText, highlightAreas.map(area => transformArea(area, rotation)), selectionData, selectionRegion
        ));
    };

    React.useEffect(() => {
        const ele = pagesRef.current;
        if (!ele) {
            return;
        }

        ele.addEventListener('mouseup', onMouseUpHandler);
        return (): void => {
            ele.removeEventListener('mouseup', onMouseUpHandler);
        };
    }, [arePagesFound, rotation]);

    React.useEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);

        return (): void => {
            store.unsubscribe('getPagesContainer', handlePagesContainer);
        };
    }, []);

    return <></>;
};

export default Tracker;
