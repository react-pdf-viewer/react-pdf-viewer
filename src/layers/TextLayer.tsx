/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../PdfJs';
import Match from '../search/Match';
import ThemeContent from '../theme/ThemeContext';
import calculateOffset from '../utils/calculateOffset';
import unwrap from '../utils/unwrap';
import wrap from '../utils/wrap';
import './textLayer.less';
import WithScale from './WithScale';

interface TextLayerProps {
    keywordRegexp: RegExp;
    match: Match;
    page: PdfJs.Page;
    pageIndex: number;
    rotation: number;
    scale: number;
    onJumpToMatch(pageIndex: number, top: number, left: number): void;
}

const TextLayer: React.FC<TextLayerProps> = ({ keywordRegexp, match, page, pageIndex, rotation, scale, onJumpToMatch }) => {
    const theme = React.useContext(ThemeContent);
    const containerRef = React.createRef<HTMLDivElement>();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const isRendered = React.useRef(false);

    const empty = () => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const spans = containerEle.querySelectorAll(`span.${theme.prefixClass}-text`);
        const numSpans = spans.length;
        for (let i = 0; i < numSpans; i++) {
            const span = spans[i];
            containerEle.removeChild(span);
        }
    };

    const renderText = () => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const viewport = page.getViewport({ rotation, scale });

        isRendered.current = false;
        page.getTextContent().then((textContent) => {
            empty();
            renderTask.current = PdfJs.renderTextLayer({
                container: containerEle,
                textContent,
                viewport,
            });
            renderTask.current.promise.then(
                (_) => {
                    isRendered.current = true;
                    const spans = containerEle.childNodes;
                    const numSpans = spans.length;

                    if (keywordRegexp) {
                        unhighlightAll();
                    }

                    for (let i = 0; i < numSpans; i++) {
                        const span = spans[i] as HTMLElement;
                        span.classList.add(`${theme.prefixClass}-text`);
                        if (keywordRegexp) {
                            highlight(span);
                        }
                    }
                    scrollToMatch();
                },
                (_) => {/**/},
            );
        });
    };

    const highlight = (span: Element) => {
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
        wrapper.classList.add(`${theme.prefixClass}-text-highlight`);
    };

    const unhighlightAll = () => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const highlightNodes = containerEle.querySelectorAll(`span.${theme.prefixClass}-text-highlight`);
        const total = highlightNodes.length;
        for (let i = 0; i < total; i++) {
            unwrap(highlightNodes[i]);
        }
    };

    const scrollToMatch = () => {
        const containerEle = containerRef.current;
        if (match.pageIndex !== pageIndex || !containerEle) {
            return;
        }

        const spans = containerEle.querySelectorAll(`span.${theme.prefixClass}-text-highlight`);
        if (match.matchIndex < spans.length) {
            const span = spans[match.matchIndex] as HTMLElement;
            const { top, left } = calculateOffset(span, containerEle);
            onJumpToMatch(pageIndex, top / scale, left / scale);
        }
    };

    React.useEffect(() => {
        const containerEle = containerRef.current;
        if (!keywordRegexp || !isRendered.current || !containerEle) {
            return;
        }

        unhighlightAll();

        if (keywordRegexp.source.trim()) {
            const spans = containerEle.querySelectorAll(`span.${theme.prefixClass}-text`);
            const numSpans = spans.length;
            for (let i = 0; i < numSpans; i++) {
                highlight(spans[i]);
            }
        }
    }, [keywordRegexp, isRendered.current]);

    React.useEffect(() => {
        if (isRendered.current) {
            scrollToMatch();
        }
    }, [match]);

    return (
        <WithScale callback={renderText} rotation={rotation} scale={scale}>
            <div className={`${theme.prefixClass}-text-layer`} ref={containerRef} />
        </WithScale>
    );
};

export default TextLayer;
