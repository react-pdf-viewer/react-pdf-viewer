/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PluginOnTextLayerRender, Store } from '@react-pdf-viewer/core';
import { LayerRenderStatus } from '@react-pdf-viewer/core';
import * as React from 'react';
import { calculateOffset } from './calculateOffset';
import { HightlightItem } from './HightlightItem';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import type { HighlightPosition } from './types/HighlightPosition';
import type { MatchPosition } from './types/MatchPosition';
import type { NormalizedKeyword } from './types/NormalizedKeyword';
import type { OnHighlightKeyword } from './types/OnHighlightKeyword';
import type { StoreProps } from './types/StoreProps';
import { unwrap } from './unwrap';

interface RenderStatus {
    ele?: HTMLElement;
    pageIndex: number;
    scale: number;
    status: LayerRenderStatus;
}

interface MatchIndexes {
    keyword: RegExp;
    startIndex: number;
    endIndex: number;
}
interface CharIndex {
    char: string;
    charIndexInSpan: number;
    spanIndex: number;
}

// Sort the highlight elements by their positions
const sortHighlightPosition = (a: HighlightPosition, b: HighlightPosition) => {
    // Compare the top values first
    if (a.top < b.top) {
        return -1;
    }
    if (a.top > b.top) {
        return 1;
    }
    // Then compare the left values
    if (a.left < b.left) {
        return -1;
    }
    if (a.left > b.left) {
        return 1;
    }
    return 0;
};

export const Tracker: React.FC<{
    numPages: number;
    pageIndex: number;
    renderHighlights?(props: HighlightPosition[]): React.ReactElement;
    store: Store<StoreProps>;
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}> = ({ numPages, pageIndex, renderHighlights, store, onHighlightKeyword }) => {
    const defaultRenderHighlights = React.useCallback(
        (highlightPos: HighlightPosition[]) => (
            <>
                {highlightPos.map((position) => (
                    <HightlightItem position={position} onHighlightKeyword={onHighlightKeyword} />
                ))}
            </>
        ),
        []
    );
    const renderHighlightElements = renderHighlights || defaultRenderHighlights;

    // The initial matching position is taken from the store
    // So the current highlight is kept (after zooming the document, for example)
    const [matchPosition, setMatchPosition] = React.useState<MatchPosition>(store.get('matchPosition'));
    const [keywordRegexp, setKeywordRegexp] = React.useState<NormalizedKeyword[]>(
        store.get('keyword') || [EMPTY_KEYWORD_REGEXP]
    );
    const [renderStatus, setRenderStatus] = React.useState<RenderStatus>({
        pageIndex,
        scale: 1,
        status: LayerRenderStatus.PreRender,
    });
    const currentMatchRef = React.useRef<HTMLElement | null>(null);
    const characterIndexesRef = React.useRef<CharIndex[]>([]);
    const [highlightPositions, setHighlightPositions] = React.useState<HighlightPosition[]>([]);

    const defaultTargetPageFilter = () => true;
    const targetPageFilter = React.useCallback(
        () => store.get('targetPageFilter') || defaultTargetPageFilter,
        [store.get('targetPageFilter')]
    );

    const unhighlightAll = (containerEle: HTMLElement): void => {
        const highlightNodes = containerEle.querySelectorAll('span.rpv-search__highlight');
        const total = highlightNodes.length;
        for (let i = 0; i < total; i++) {
            highlightNodes[i].parentElement.removeChild(highlightNodes[i]);
        }
    };

    const highlight = (
        keywordStr: string,
        keyword: RegExp,
        containerEle: Element,
        span: HTMLElement,
        charIndexSpan: CharIndex[]
    ): HighlightPosition => {
        const range = document.createRange();

        const firstChild = span.firstChild;
        if (!firstChild) {
            return;
        }

        const startOffset = charIndexSpan[0].charIndexInSpan;
        const endOffset =
            charIndexSpan.length === 1 ? startOffset : charIndexSpan[charIndexSpan.length - 1].charIndexInSpan;

        range.setStart(firstChild, startOffset);
        range.setEnd(firstChild, endOffset + 1);

        const wrapper = document.createElement('span');
        range.surroundContents(wrapper);

        const wrapperRect = wrapper.getBoundingClientRect();
        const containerRect = containerEle.getBoundingClientRect();

        const left = (100 * (wrapperRect.left - containerRect.left)) / containerRect.width;
        const top = (100 * (wrapperRect.top - containerRect.top)) / containerRect.height;
        const height = (100 * wrapperRect.height) / containerRect.height;
        const width = (100 * wrapperRect.width) / containerRect.width;

        unwrap(wrapper);

        return {
            keyword,
            keywordStr,
            numPages,
            pageIndex,
            left,
            top,
            height,
            width,
        };
    };

    const highlightAll = (containerEle: Element): HighlightPosition[] => {
        const charIndexes = characterIndexesRef.current;
        if (charIndexes.length === 0) {
            return;
        }

        const highlightPos: HighlightPosition[] = [];
        const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('.rpv-core__text-layer-text'));

        // Generate the full text of page
        const fullText = charIndexes.map((item) => item.char).join('');

        keywordRegexp.forEach((keyword) => {
            const keywordStr = keyword.keyword;
            if (!keywordStr.trim()) {
                return;
            }

            // Clone the keyword regular expression, and add the global (`g`) flag
            // If the `g` flag is missing, it will lead to an infinitive loop
            const cloneKeyword =
                keyword.regExp.flags.indexOf('g') === -1
                    ? new RegExp(keyword.regExp, `${keyword.regExp.flags}g`)
                    : keyword.regExp;

            // Find all matches in the full text
            let match;
            const matches: MatchIndexes[] = [];
            while ((match = cloneKeyword.exec(fullText)) !== null) {
                matches.push({
                    keyword: cloneKeyword,
                    startIndex: match.index as number,
                    endIndex: cloneKeyword.lastIndex,
                });
            }

            matches
                .map((item) => ({
                    keyword: item.keyword,
                    indexes: charIndexes.slice(item.startIndex, item.endIndex),
                }))
                .forEach((item) => {
                    // Group by the span index
                    const spanIndexes = item.indexes.reduce((acc, item) => {
                        acc[item.spanIndex] = (acc[item.spanIndex] || ([] as CharIndex[])).concat([item]);
                        return acc;
                    }, {} as { [spanIndex: number]: CharIndex[] });
                    Object.values(spanIndexes).forEach((charIndexSpan) => {
                        // Ignore the space between words
                        if (charIndexSpan.length !== 1 || charIndexSpan[0].char.trim() !== '') {
                            // Ignore the first and last spaces if we are finding the whole word
                            const normalizedCharSpan = keyword.wholeWords ? charIndexSpan.slice(1, -1) : charIndexSpan;
                            highlightPos.push(
                                highlight(
                                    keywordStr,
                                    item.keyword,
                                    containerEle,
                                    spans[normalizedCharSpan[0].spanIndex],
                                    normalizedCharSpan
                                )
                            );
                        }
                    });
                });
        });

        // Sort the highlight elements as they appear in the texts
        return highlightPos.sort(sortHighlightPosition);
    };

    const handleKeywordChanged = (keyword?: NormalizedKeyword[]) => {
        if (keyword && keyword.length > 0) {
            setKeywordRegexp(keyword);
        }
    };

    const handleMatchPositionChanged = (currentPosition: MatchPosition) => setMatchPosition(currentPosition);

    const handleRenderStatusChanged = (status: Map<number, PluginOnTextLayerRender>) => {
        if (!status.has(pageIndex)) {
            return;
        }
        const currentStatus = status.get(pageIndex);
        if (currentStatus) {
            setRenderStatus({
                ele: currentStatus.ele,
                pageIndex,
                scale: currentStatus.scale,
                status: currentStatus.status,
            });
        }
    };

    const isEmptyKeyword = () =>
        keywordRegexp.length === 0 || (keywordRegexp.length === 1 && keywordRegexp[0].keyword.trim() === '');

    // Prepare the characters indexes
    // The order of hooks are important. Since `charIndexes` will be used when we highlight matching items,
    // this hook is put at the top
    React.useEffect(() => {
        if (
            isEmptyKeyword() ||
            renderStatus.status !== LayerRenderStatus.DidRender ||
            characterIndexesRef.current.length
        ) {
            return;
        }

        const containerEle = renderStatus.ele;
        const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('.rpv-core__text-layer-text'));

        const charIndexes: CharIndex[] = spans
            .map((span) => span.textContent)
            .reduce(
                (prev, curr, index) =>
                    prev.concat(
                        curr.split('').map((c, i) => ({
                            char: c,
                            charIndexInSpan: i,
                            spanIndex: index,
                        }))
                    ),
                [
                    {
                        char: '',
                        charIndexInSpan: 0,
                        spanIndex: 0,
                    },
                ]
            )
            .slice(1);

        characterIndexesRef.current = charIndexes;
    }, [keywordRegexp, renderStatus.status]);

    React.useEffect(() => {
        if (
            isEmptyKeyword() ||
            !renderStatus.ele ||
            renderStatus.status !== LayerRenderStatus.DidRender ||
            !targetPageFilter()({ pageIndex, numPages })
        ) {
            return;
        }

        const containerEle = renderStatus.ele;
        unhighlightAll(containerEle);

        const highlightPos = highlightAll(containerEle);
        setHighlightPositions(highlightPos);

        scrollToMatch();
    }, [keywordRegexp, matchPosition, renderStatus.status, characterIndexesRef.current]);

    React.useEffect(() => {
        if (isEmptyKeyword() && renderStatus.ele && renderStatus.status === LayerRenderStatus.DidRender) {
            unhighlightAll(renderStatus.ele);
            setHighlightPositions([]);
        }
    }, [keywordRegexp, renderStatus.status]);

    const scrollToMatch = (): void => {
        if (
            matchPosition.pageIndex !== pageIndex ||
            !renderStatus.ele ||
            renderStatus.status !== LayerRenderStatus.DidRender
        ) {
            return;
        }

        const container = renderStatus.ele;
        const highlightEle = container.querySelector(
            `.rpv-search__highlight[data-index="${matchPosition.matchIndex}"]`
        );
        if (!highlightEle) {
            return;
        }

        const { left, top } = calculateOffset(highlightEle as HTMLElement, container);
        const jump = store.get('jumpToDestination');
        if (jump) {
            jump(
                pageIndex,
                (container.getBoundingClientRect().height - top) / renderStatus.scale,
                left / renderStatus.scale,
                renderStatus.scale
            );
            if (currentMatchRef.current) {
                currentMatchRef.current.classList.remove('rpv-search__highlight--current');
            }
            currentMatchRef.current = highlightEle as HTMLElement;
            highlightEle.classList.add('rpv-search__highlight--current');
        }
    };

    React.useEffect(() => {
        store.subscribe('keyword', handleKeywordChanged);
        store.subscribe('matchPosition', handleMatchPositionChanged);
        store.subscribe('renderStatus', handleRenderStatusChanged);

        return () => {
            store.unsubscribe('keyword', handleKeywordChanged);
            store.unsubscribe('matchPosition', handleMatchPositionChanged);
            store.unsubscribe('renderStatus', handleRenderStatusChanged);
        };
    }, []);

    return renderHighlightElements(highlightPositions);
};
