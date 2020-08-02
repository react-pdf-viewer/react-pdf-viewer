/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { PluginOnTextLayerRender, TextLayerRenderStatus, Store } from '@phuocng/rpv';

import './highlight.less';
import StoreProps from './StoreProps';
import unwrap from './unwrap';
import wrap from './wrap';

// `new RegExp('')` will treat the source as `(?:)` which is not an empty string
const EMPTY_KEYWORD_REGEXP = new RegExp(' ');

interface RenderStatus {
    ele?: HTMLElement;
    pageIndex: number;
    status: TextLayerRenderStatus;
}

const Tracker: React.FC<{
    pageIndex: number,
    store: Store<StoreProps>,
}> = ({ pageIndex, store }) => {
    const [keywordRegexp, setKeywordRegexp] = useState<RegExp>(EMPTY_KEYWORD_REGEXP);
    const [renderStatus, setRenderStatus] = useState<RenderStatus>({
        pageIndex,
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

    const handleRenderStatusChanged = (status: Map<number, PluginOnTextLayerRender>) => {
        if (!status.has(pageIndex)) {
            return;
        }
        const currentStatus = status.get(pageIndex);
        if (currentStatus) {
            setRenderStatus({
                ele: currentStatus.ele,
                pageIndex,
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
    }, [keywordRegexp, renderStatus]);
    
    useEffect(() => {
        store.subscribe('keyword', handleKeywordChanged);
        store.subscribe('renderStatus', handleRenderStatusChanged);

        return () => {
            store.unsubscribe('keyword', handleKeywordChanged);
            store.unsubscribe('renderStatus', handleRenderStatusChanged);
        };
    }, []);
    
    return <></>;
};

export default Tracker;
