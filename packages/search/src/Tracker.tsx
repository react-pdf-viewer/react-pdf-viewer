/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PluginOnTextLayerRender, LayerRenderStatus, Store } from '@react-pdf-viewer/core';

import calculateOffset from './calculateOffset';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import Match from './Match';
import StoreProps from './StoreProps';
import OnHighlightKeyword from './types/OnHighlightKeyword';
import unwrap from './unwrap';

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

const Tracker: React.FC<{
    pageIndex: number,
    store: Store<StoreProps>,
    onHighlightKeyword?(props: OnHighlightKeyword): void,
}> = ({ pageIndex, store, onHighlightKeyword }) => {
    const [match, setMatch] = React.useState<Match>({
        matchIndex: -1,
        pageIndex: -1,
    });
    const [keywordRegexp, setKeywordRegexp] = React.useState<RegExp[]>([EMPTY_KEYWORD_REGEXP]);
    const [renderStatus, setRenderStatus] = React.useState<RenderStatus>({
        pageIndex,
        scale: 1,
        status: LayerRenderStatus.PreRender,
    });
    const currentMatchRef = React.useRef<HTMLElement | null>(null);
    const characterIndexesRef = React.useRef<CharIndex[]>([]);

    const unhighlightAll = (containerEle: HTMLElement): void => {
        const highlightNodes = containerEle.querySelectorAll('span.rpv-search-text-highlight');
        const total = highlightNodes.length;
        for (let i = 0; i < total; i++) {
            highlightNodes[i].parentElement.removeChild(highlightNodes[i]);
        }
    };

    const highlight = (keyword: RegExp, containerEle: Element, span: HTMLElement, charIndexSpan: CharIndex[]): void => {
        const range = document.createRange();

        const firstChild = span.firstChild;
        if (!firstChild) {
            return;
        }
        
        const startOffset = charIndexSpan[0].charIndexInSpan;
        const endOffset = charIndexSpan.length === 1
                        ? startOffset
                        : charIndexSpan[charIndexSpan.length - 1].charIndexInSpan;

        range.setStart(firstChild, startOffset);
        range.setEnd(firstChild, endOffset + 1);

        const wrapper = document.createElement('span');
        range.surroundContents(wrapper);

        const wrapperRect = wrapper.getBoundingClientRect();
        const containerRect = containerEle.getBoundingClientRect();

        const highlightEle = document.createElement('span');
        containerEle.appendChild(highlightEle);

        highlightEle.style.left = `${100 * (wrapperRect.left - containerRect.left) / containerRect.width}%`;
        highlightEle.style.top = `${100 * (wrapperRect.top - containerRect.top) / containerRect.height}%`;
        highlightEle.style.width = `${100 * (wrapperRect.width) / containerRect.width}%`;
        highlightEle.style.height = `${100 * (wrapperRect.height) / containerRect.height}%`;
        highlightEle.classList.add('rpv-search-text-highlight');

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

        const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('.rpv-core-text'));

        // Generate the full text of page
        const fullText = charIndexes.map(item => item.char).join('');

        keywordRegexp.forEach(keyword => {
            const keywordStr = keyword.source;
            if (!keywordStr.trim()) {
                return;
            }

            // Clone the keyword regular expression, and add the global (`g`) flag
            // If the `g` flag is missing, it will lead to an infinitive loop
            const cloneKeyword = keyword.flags.indexOf('g') === -1 ? new RegExp(keyword, `${keyword.flags}g`) : keyword;

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

            matches.map(item => ({
                keyword: item.keyword, 
                indexes: charIndexes.slice(item.startIndex, item.endIndex)
            })).forEach(item => {
                // Group by the span index
                const spanIndexes = item.indexes.reduce(
                    (acc, item) => {
                        acc[item.spanIndex] = [...(acc[item.spanIndex] || []), item];
                        return acc;
                    },
                    {} as { [spanIndex: number]: CharIndex[] }
                );
                Object.values(spanIndexes).forEach(charIndexSpan => {
                    highlight(item.keyword, containerEle, spans[charIndexSpan[0].spanIndex], charIndexSpan);
                });
            });
        });
    };

    const handleKeywordChanged = (keyword?: RegExp[]) => {
        if (keyword && keyword.length > 0) {
            setKeywordRegexp(keyword);
        }
    };

    const handleMatchChanged = (currentMatch: Match) => {
        setMatch(currentMatch);
    };

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

    const isEmptyKeyword = () => keywordRegexp.length === 0 || (keywordRegexp.length === 1 && keywordRegexp[0].source.trim() === '');

    // Prepare the characters indexes
    // The order of hooks are important. Since `charIndexes` will be used when we highlight matching items,
    // this hook is put at the top
    React.useEffect(() => {
        if (isEmptyKeyword() || renderStatus.status !== LayerRenderStatus.DidRender || characterIndexesRef.current.length) {
            return;
        }

        const containerEle = renderStatus.ele;
        const spans: HTMLElement[] = [].slice.call(containerEle.querySelectorAll('.rpv-core-text'));

        const charIndexes: CharIndex[] = spans.map(span => span.textContent)
            .reduce(
                (prev, curr, index) => prev.concat(curr.split('').map((c, i) => ({
                    char: c,
                    charIndexInSpan: i,
                    spanIndex: index,
                }))),
                [
                    {
                        char: '',
                        charIndexInSpan: 0,
                        spanIndex: 0,
                    }
                ]
            )
            .slice(1);

        characterIndexesRef.current = charIndexes;
    }, [keywordRegexp, renderStatus.status]);

    React.useEffect(() => {
        if (isEmptyKeyword() || !renderStatus.ele || renderStatus.status !== LayerRenderStatus.DidRender) {
            return;
        }
        
        const containerEle = renderStatus.ele;
        unhighlightAll(containerEle);
        highlightAll(containerEle);
        scrollToMatch();
    }, [keywordRegexp, match, renderStatus.status, characterIndexesRef.current]);

    React.useEffect(() => {
        if (isEmptyKeyword() && renderStatus.ele && renderStatus.status === LayerRenderStatus.DidRender) {
            unhighlightAll(renderStatus.ele);
        }
    }, [keywordRegexp, renderStatus.status]);

    const scrollToMatch = (): void => {
        if (match.pageIndex !== pageIndex || !renderStatus.ele || renderStatus.status !== LayerRenderStatus.DidRender) {
            return;
        }
        
        const container = renderStatus.ele;
        const spans = container.querySelectorAll('.rpv-search-text-highlight');
        if (match.matchIndex < spans.length) {
            const span = spans[match.matchIndex] as HTMLElement;
            const { left, top } = calculateOffset(span, container);
            const jump = store.get('jumpToDestination');
            if (jump) {
                jump(pageIndex, (container.getBoundingClientRect().height - top) / renderStatus.scale, left / renderStatus.scale, renderStatus.scale);
                if (currentMatchRef.current) {
                    currentMatchRef.current.classList.remove('rpv-search-text-highlight-current');
                }
                currentMatchRef.current = span;
                span.classList.add('rpv-search-text-highlight-current');
            }
        }
    };
    
    React.useEffect(() => {
        store.subscribe('keyword', handleKeywordChanged);
        store.subscribe('match', handleMatchChanged);
        store.subscribe('renderStatus', handleRenderStatusChanged);

        return () => {
            store.unsubscribe('keyword', handleKeywordChanged);
            store.unsubscribe('match', handleMatchChanged);
            store.unsubscribe('renderStatus', handleRenderStatusChanged);
        };
    }, []);
    
    return <></>;
};

export default Tracker;
