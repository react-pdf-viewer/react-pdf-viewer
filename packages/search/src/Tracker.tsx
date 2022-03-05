/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LayerRenderStatus } from '@react-pdf-viewer/core';
import type { PluginOnTextLayerRender, Store } from '@react-pdf-viewer/core';

import { calculateOffset } from './calculateOffset';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import { unwrap } from './unwrap';
import type { MatchPosition } from './types/MatchPosition';
import type { NormalizedKeyword } from './types/NormalizedKeyword';
import type { OnHighlightKeyword } from './types/OnHighlightKeyword';
import type { StoreProps } from './types/StoreProps';

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

const percentToNumber = (input: string): number => parseFloat(input.slice(0, -1));

// Sort the highlight elements by their positions
const sortHighlightElements = (a: HTMLElement, b: HTMLElement) => {
    const aTop = percentToNumber(a.style.top);
    const aLeft = percentToNumber(a.style.left);
    const bTop = percentToNumber(b.style.top);
    const bLeft = percentToNumber(b.style.left);

    // Compare the top values first
    if (aTop < bTop) {
        return -1;
    }
    if (aTop > bTop) {
        return 1;
    }
    // Then compare the left values
    if (aLeft < bLeft) {
        return -1;
    }
    if (aLeft > bLeft) {
        return 1;
    }
    return 0;
};

export const Tracker: React.FC<{
    numPages: number;
    pageIndex: number;
    store: Store<StoreProps>;
    onHighlightKeyword?(props: OnHighlightKeyword): void;
}> = ({ numPages, pageIndex, store, onHighlightKeyword }) => {
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
    ): void => {
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

        const highlightEle = document.createElement('span');
        containerEle.insertBefore(highlightEle, containerEle.firstChild);

        highlightEle.style.left = `${(100 * (wrapperRect.left - containerRect.left)) / containerRect.width}%`;
        highlightEle.style.top = `${(100 * (wrapperRect.top - containerRect.top)) / containerRect.height}%`;
        highlightEle.style.width = `${(100 * wrapperRect.width) / containerRect.width}%`;
        highlightEle.style.height = `${(100 * wrapperRect.height) / containerRect.height}%`;
        highlightEle.classList.add('rpv-search__highlight');
        highlightEle.setAttribute('title', keywordStr.trim());

        unwrap(wrapper);

        if (onHighlightKeyword) {
            onHighlightKeyword({
                highlightEle,
                keyword,
            });
        }
    };

    const highlightAll = (containerEle: Element): void => {
        const charIndexes = characterIndexesRef.current;
        if (charIndexes.length === 0) {
            return;
        }

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
                        // Ignore the spaces between words
                        if (charIndexSpan[0].char.trim() !== '') {
                            highlight(
                                keywordStr,
                                item.keyword,
                                containerEle,
                                spans[charIndexSpan[0].spanIndex],
                                charIndexSpan
                            );
                        }
                    });
                });
        });

        const highlightEles: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('.rpv-search__highlight'));
        // Sort the highlight elements as they appear in the texts
        highlightEles.sort(sortHighlightElements).forEach((ele, i) => {
            ele.setAttribute('data-index', `${i}`);
        });
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
        highlightAll(containerEle);
        scrollToMatch();
    }, [keywordRegexp, matchPosition, renderStatus.status, characterIndexesRef.current]);

    React.useEffect(() => {
        if (isEmptyKeyword() && renderStatus.ele && renderStatus.status === LayerRenderStatus.DidRender) {
            unhighlightAll(renderStatus.ele);
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

    return <></>;
};
