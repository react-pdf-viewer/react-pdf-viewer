/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { createRef, useContext, useRef } from 'react';

import ThemeContext from '../theme/ThemeContext';
import { Plugin } from '../types/Plugin';
import TextLayerRenderStatus from '../types/TextLayerRenderStatus';
import PdfJs from '../vendors/PdfJs';
import './textLayer.less';
import WithScale from './WithScale';

interface TextLayerProps {
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
}

const TextLayer: React.FC<TextLayerProps> = ({ page, pageIndex, plugins, rotation, scale }) => {
    const theme = useContext(ThemeContext);
    const containerRef = createRef<HTMLDivElement>();
    const renderTask = useRef<PdfJs.PageRenderTask>();

    const empty = (): void => {
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

    const renderText = (): void => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }
        const viewport = page.getViewport({ rotation, scale });

        plugins.forEach(plugin => {
            if (plugin.onTextLayerRender) {
                plugin.onTextLayerRender({
                    ele: containerEle,
                    pageIndex,
                    scale,
                    status: TextLayerRenderStatus.PreRender,
                });
            }
        });
        page.getTextContent().then((textContent) => {
            empty();
            renderTask.current = PdfJs.renderTextLayer({
                container: containerEle,
                textContent,
                viewport,
            });
            renderTask.current.promise.then(
                () => {
                    const spans = containerEle.childNodes;
                    const numSpans = spans.length;
                    for (let i = 0; i < numSpans; i++) {
                        const span = spans[i] as HTMLElement;
                        span.classList.add(`${theme.prefixClass}-text`);
                    }
                    plugins.forEach(plugin => {
                        if (plugin.onTextLayerRender) {
                            plugin.onTextLayerRender({
                                ele: containerEle,
                                pageIndex,
                                scale,
                                status: TextLayerRenderStatus.DidRender,
                            });
                        }
                    });
                },
                () => {/**/},
            );
        });
    };

    return (
        <WithScale callback={renderText} rotation={rotation} scale={scale}>
            <div className={`${theme.prefixClass}-text-layer`} ref={containerRef} />
        </WithScale>
    );
};

export default TextLayer;
