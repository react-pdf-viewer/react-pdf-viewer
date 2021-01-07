/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from '../theme/ThemeContext';
import LayerRenderStatus from '../types/LayerRenderStatus';
import { Plugin } from '../types/Plugin';
import PdfJs from '../vendors/PdfJs';
import WithScale from './WithScale';

interface TextLayerProps {
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
}

const TextLayer: React.FC<TextLayerProps> = ({ page, pageIndex, plugins, rotation, scale }) => {
    const theme = React.useContext(ThemeContext);
    const containerRef = React.createRef<HTMLDivElement>();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

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
                    status: LayerRenderStatus.PreRender,
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
                                status: LayerRenderStatus.DidRender,
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
