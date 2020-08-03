/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { PluginOnTextLayerRender, TextLayerRenderStatus, Store } from '@phuocng/rpv';

import calculateOffset from './calculateOffset';
import { EMPTY_KEYWORD_REGEXP } from './constants';
import './highlight.less';
import Match from './Match';
import StoreProps from './StoreProps';
import unwrap from './unwrap';
import wrap from './wrap';

interface RenderStatus {
    ele?: HTMLElement;
    pageIndex: number;
    scale: number;
    status: TextLayerRenderStatus;
}

const Tracker: React.FC<{
    pageIndex: number,
    store: Store<StoreProps>,
}> = ({ pageIndex, store }) => {
    const [match, setMatch] = useState<Match>({
        matchIndex: -1,
        pageIndex: -1,
    });
    const [keywordRegexp, setKeywordRegexp] = useState<RegExp>(EMPTY_KEYWORD_REGEXP);
    const [renderStatus, setRenderStatus] = useState<RenderStatus>({
        pageIndex,
        scale: 1,
        status: TextLayerRenderStatus.PreRender,
    });

    const unhighlightAll = (containerEle: HTMLElement): void => {
        const highlightNodes = containerEle.querySelectorAll('span.rpv-search-text-highlight');
        const total = highlightNodes.length;
        for (let i = 0; i < total; i++) {
            unwrap(highlightNodes[i]);
        }
    };

    const highlight = (span: Element): void => {
        const text = span.textContent;
        if (!keywordRegexp.source.trim() || !text) {
            return;
        }

        const startOffset = text.search(keywordRegexp);
        const firstChild = span.firstChild;
        if (startOffset === -1 || !firstChild) {
            return;
        }
        const endOffset = startOffset + keywordRegexp.source.length;
        const wrapper = wrap(firstChild, startOffset, endOffset);
        wrapper.classList.add('rpv-search-text-highlight');
    };

    const handleKeywordChanged = (keyword: RegExp) => {
        setKeywordRegexp(keyword);
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

    useEffect(() => {
        if (!keywordRegexp.source.trim() || !renderStatus.ele || renderStatus.status !== TextLayerRenderStatus.DidRender) {
            return;
        }
        const containerEle = renderStatus.ele;
        const spans = containerEle.childNodes;
        const numSpans = spans.length;
        unhighlightAll(containerEle);

        for (let i = 0; i < numSpans; i++) {
            const span = spans[i] as HTMLElement;
            highlight(span);
        }
        scrollToMatch();
    }, [keywordRegexp, match, renderStatus]);

    const scrollToMatch = (): void => {
        if (match.pageIndex !== pageIndex || !renderStatus.ele || renderStatus.status !== TextLayerRenderStatus.DidRender) {
            return;
        }
        
        const container = renderStatus.ele;
        const spans = container.querySelectorAll('.rpv-search-text-highlight');
        if (match.matchIndex < spans.length) {
            const span = spans[match.matchIndex] as HTMLElement;
            const { top } = calculateOffset(span, container);
            const jump = store.get('jumpToDestination');
            if (jump) {
                jump(pageIndex, (container.getBoundingClientRect().height - top) / renderStatus.scale, renderStatus.scale);
            }
        }
    };
    
    useEffect(() => {
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
