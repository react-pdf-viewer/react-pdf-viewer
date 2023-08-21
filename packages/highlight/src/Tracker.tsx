/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HIGHLIGHT_LAYER_ATTR, HIGHLIGHT_PAGE_ATTR } from './constants';
import { getRectFromOffsets } from './getRectFromOffsets';
import { getTextFromOffsets } from './getTextFromOffsets';
import { SelectionRange } from './structs/SelectionRange';
import { Trigger } from './structs/Trigger';
import { transformArea } from './transformArea';
import { DivText } from './types/DivText';
import { type HighlightArea } from './types/HighlightArea';
import { HighlightStateType } from './types/HighlightState';
import { type SelectionData } from './types/SelectionData';
import { type StoreProps } from './types/StoreProps';
import { useRotation } from './useRotation';

// `\n` is the document selection string when double clicking a page without selecting any text
const EMPTY_SELECTION = ['', '\n'];

export const Tracker: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const { rotation } = useRotation(store);
    const pagesRef = React.useRef<HTMLElement | null>(null);
    const [arePagesFound, setPagesFound] = React.useState(false);
    const [trigger, setTrigger] = React.useState(store.get('trigger'));

    const handlePagesContainer = (getPagesContainer: () => HTMLElement) => {
        const ele = getPagesContainer();
        pagesRef.current = ele;
        setPagesFound(!!ele);
    };

    const handleTrigger = (trigger: Trigger) => setTrigger(trigger);

    const onMouseUpHandler = () => {
        // Get the current selection
        const selection = document.getSelection();

        const highlightState = store.get('highlightState');
        const hasSelection =
            (highlightState.type === HighlightStateType.NoSelection ||
                highlightState.type === HighlightStateType.Selected) &&
            selection.rangeCount > 0 &&
            EMPTY_SELECTION.indexOf(selection.toString()) === -1;
        if (!hasSelection) {
            return;
        }

        const range = selection.getRangeAt(0);
        const startDiv = range.startContainer.parentNode;
        const parentEndContainer = range.endContainer.parentNode;
        const shouldIgnoreEndContainer =
            parentEndContainer instanceof HTMLElement && parentEndContainer.hasAttribute(HIGHLIGHT_LAYER_ATTR);

        let endDiv: Node, endOffset: number;

        // Detect double-click
        if (startDiv && startDiv.parentNode == range.endContainer) {
            endDiv = startDiv;
            endOffset = endDiv.textContent.length;
        } else if (shouldIgnoreEndContainer && range.endOffset == 0) {
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

        const startPageIndex = parseInt(startDiv.getAttribute(HIGHLIGHT_PAGE_ATTR), 10);
        const endPageIndex = parseInt(endDiv.getAttribute(HIGHLIGHT_PAGE_ATTR), 10);

        const startTextLayer = startDiv.parentElement;
        const endTextLayer = endDiv.parentElement;

        const startPageRect = startTextLayer.getBoundingClientRect();
        const startDivSiblings: HTMLElement[] = [].slice.call(
            startTextLayer.querySelectorAll(`[${HIGHLIGHT_PAGE_ATTR}]`),
        );
        const startDivIndex = startDivSiblings.indexOf(startDiv);

        const endPageRect = endTextLayer.getBoundingClientRect();
        const endDivSiblings: HTMLElement[] = [].slice.call(endTextLayer.querySelectorAll(`[${HIGHLIGHT_PAGE_ATTR}]`));
        const endDivIndex = endDivSiblings.indexOf(endDiv);

        const startOffset = range.startOffset;

        let rangeType: SelectionRange = SelectionRange.DifferentPages;
        switch (true) {
            case startPageIndex === endPageIndex && startDivIndex === endDivIndex:
                rangeType = SelectionRange.SameDiv;
                break;
            case startPageIndex === endPageIndex && startDivIndex < endDivIndex:
                rangeType = SelectionRange.DifferentDivs;
                break;
            default:
                rangeType = SelectionRange.DifferentPages;
                break;
        }

        const getRectBetween = (min: number, max: number, eleArray: HTMLElement[]) =>
            Array(max - min + 1)
                .fill(0)
                .map((_, i) => eleArray[min + i].getBoundingClientRect());

        let highlightAreas: HighlightArea[] = [];
        switch (rangeType) {
            case SelectionRange.SameDiv:
                // eslint-disable-next-line no-case-declarations
                const rect = getRectFromOffsets(startDiv, startOffset, endOffset);
                highlightAreas = [
                    {
                        height: (rect.height * 100) / startPageRect.height,
                        left: ((rect.left - startPageRect.left) * 100) / startPageRect.width,
                        pageIndex: startPageIndex,
                        top: ((rect.top - startPageRect.top) * 100) / startPageRect.height,
                        width: (rect.width * 100) / startPageRect.width,
                    },
                ];
                break;

            case SelectionRange.DifferentDivs:
                highlightAreas = [getRectFromOffsets(startDiv, startOffset, startDiv.textContent.length)]
                    .concat(getRectBetween(startDivIndex + 1, endDivIndex - 1, startDivSiblings))
                    .concat([getRectFromOffsets(endDiv, 0, endOffset)])
                    .map((rect) => {
                        return {
                            height: (rect.height * 100) / startPageRect.height,
                            left: ((rect.left - startPageRect.left) * 100) / startPageRect.width,
                            pageIndex: startPageIndex,
                            top: ((rect.top - startPageRect.top) * 100) / startPageRect.height,
                            width: (rect.width * 100) / startPageRect.width,
                        };
                    });
                break;

            case SelectionRange.DifferentPages:
                // eslint-disable-next-line no-case-declarations
                const startAreas = [getRectFromOffsets(startDiv, startOffset, startDiv.textContent.length)]
                    .concat(getRectBetween(startDivIndex + 1, startDivSiblings.length - 1, startDivSiblings))
                    .map((rect) => {
                        return {
                            height: (rect.height * 100) / startPageRect.height,
                            left: ((rect.left - startPageRect.left) * 100) / startPageRect.width,
                            pageIndex: startPageIndex,
                            top: ((rect.top - startPageRect.top) * 100) / startPageRect.height,
                            width: (rect.width * 100) / startPageRect.width,
                        };
                    });
                // eslint-disable-next-line no-case-declarations
                const endAreas = getRectBetween(0, endDivIndex - 1, endDivSiblings)
                    .concat([getRectFromOffsets(endDiv, 0, endOffset)])
                    .map((rect) => {
                        return {
                            height: (rect.height * 100) / endPageRect.height,
                            left: ((rect.left - endPageRect.left) * 100) / endPageRect.width,
                            pageIndex: endPageIndex,
                            top: ((rect.top - endPageRect.top) * 100) / endPageRect.height,
                            width: (rect.width * 100) / endPageRect.width,
                        };
                    });
                highlightAreas = startAreas.concat(endAreas);
                break;
        }

        // Determine the selected text
        let selectedText = '';
        let divTexts: DivText[] = [];
        switch (rangeType) {
            case SelectionRange.SameDiv:
                // eslint-disable-next-line no-case-declarations
                const textDataSameDiv = getTextFromOffsets(
                    startDivSiblings,
                    startPageIndex,
                    startDivIndex,
                    startOffset,
                    startDivIndex,
                    endOffset,
                );
                selectedText = textDataSameDiv.wholeText;
                divTexts = textDataSameDiv.divTexts;
                break;

            case SelectionRange.DifferentDivs:
                // eslint-disable-next-line no-case-declarations
                const textDataDifferentDivs = getTextFromOffsets(
                    startDivSiblings,
                    startPageIndex,
                    startDivIndex,
                    startOffset,
                    endDivIndex,
                    endOffset,
                );
                selectedText = textDataDifferentDivs.wholeText;
                divTexts = textDataDifferentDivs.divTexts;
                break;

            case SelectionRange.DifferentPages:
                // eslint-disable-next-line no-case-declarations
                const startTextData = getTextFromOffsets(
                    startDivSiblings,
                    startPageIndex,
                    startDivIndex,
                    startOffset,
                    startDivSiblings.length,
                );

                // eslint-disable-next-line no-case-declarations
                const endTextData = getTextFromOffsets(endDivSiblings, endPageIndex, 0, 0, endDivIndex, endOffset);

                selectedText = `${startTextData.wholeText}\n${endTextData.wholeText}`;
                divTexts = startTextData.divTexts.concat(endTextData.divTexts);
                break;
        }

        let selectionRegion: HighlightArea;
        if (highlightAreas.length > 0) {
            selectionRegion = highlightAreas[highlightAreas.length - 1];
        } else {
            const endDivRect = endDiv.getBoundingClientRect();
            selectionRegion = {
                height: (endDivRect.height * 100) / endPageRect.height,
                left: ((endDivRect.left - endPageRect.left) * 100) / endPageRect.width,
                pageIndex: endPageIndex,
                top: ((endDivRect.top - endPageRect.top) * 100) / endPageRect.height,
                width: (endDivRect.width * 100) / endPageRect.width,
            };
        }

        const selectionData: SelectionData = {
            divTexts,
            selectedText,
            startPageIndex,
            endPageIndex,
            startOffset,
            startDivIndex,
            endOffset,
            endDivIndex,
        };

        const selectedState = {
            type: HighlightStateType.Selected,
            selectedText,
            highlightAreas: highlightAreas.map((area) => transformArea(area, rotation)),
            selectionData,
            selectionRegion,
        };
        store.update('highlightState', selectedState);
    };

    React.useEffect(() => {
        const ele = pagesRef.current;
        if (!ele || trigger === Trigger.None) {
            return;
        }

        ele.addEventListener('mouseup', onMouseUpHandler);
        return (): void => {
            ele.removeEventListener('mouseup', onMouseUpHandler);
        };
    }, [arePagesFound, trigger, rotation]);

    React.useEffect(() => {
        store.subscribe('getPagesContainer', handlePagesContainer);
        store.subscribe('trigger', handleTrigger);

        return (): void => {
            store.unsubscribe('getPagesContainer', handlePagesContainer);
            store.unsubscribe('trigger', handleTrigger);
        };
    }, []);

    return <></>;
};
