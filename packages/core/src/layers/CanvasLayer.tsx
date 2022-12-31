/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { LayerRenderStatus } from '../structs/LayerRenderStatus';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';
import { floatToRatio } from '../utils/floatToRatio';
import { roundToDivide } from '../utils/roundToDivide';

// The mobile browsers have the limit value for maximum canvas size
// The values vary but here we set a maximum value of 16 mega-pixels
const MAX_CANVAS_SIZE = 4096 * 4096;

export const CanvasLayer: React.FC<{
    canvasLayerRef: React.MutableRefObject<HTMLCanvasElement>;
    height: number;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    width: number;
    onRenderCanvasCompleted: () => void;
}> = ({ canvasLayerRef, height, page, pageIndex, plugins, rotation, scale, width, onRenderCanvasCompleted }) => {
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

    useIsomorphicLayoutEffect(() => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvasEle = canvasLayerRef.current;
        canvasEle.removeAttribute('data-testid');
        plugins.forEach((plugin) => {
            if (plugin.onCanvasLayerRender) {
                plugin.onCanvasLayerRender({
                    ele: canvasEle,
                    pageIndex,
                    rotation,
                    scale,
                    status: LayerRenderStatus.PreRender,
                });
            }
        });

        const viewport = page.getViewport({
            rotation,
            scale,
        });

        // Support high DPI screens
        let outputScale = window.devicePixelRatio || 1;

        // Calculate the maximum scale
        const maxScale = Math.sqrt(MAX_CANVAS_SIZE / (viewport.width * viewport.height));

        // Scale by CSS to avoid the crash
        const shouldScaleByCSS = outputScale > maxScale;
        shouldScaleByCSS ? (canvasEle.style.transform = `scale(1, 1)`) : canvasEle.style.removeProperty('transform');

        const possibleScale = Math.min(maxScale, outputScale);
        const [x, y] = floatToRatio(possibleScale, 8);

        // Set the size for canvas here instead of inside `render` to avoid the black flickering
        canvasEle.width = roundToDivide(viewport.width * possibleScale, x);
        canvasEle.height = roundToDivide(viewport.height * possibleScale, x);
        canvasEle.style.width = `${roundToDivide(viewport.width, y)}px`;
        canvasEle.style.height = `${roundToDivide(viewport.height, y)}px`;

        // Hide the canvas element
        // Setting `hidden` is safer than the opacity (such as canvasEle.style.opacity = '0')
        // Setting the opacity style can cause the issue where the page is blank until users scroll or interact with the page
        canvasEle.hidden = true;

        const canvasContext = canvasEle.getContext('2d', { alpha: false });

        const transform = shouldScaleByCSS || outputScale !== 1 ? [possibleScale, 0, 0, possibleScale, 0, 0] : null;
        renderTask.current = page.render({ canvasContext, transform, viewport });
        renderTask.current.promise.then(
            (): void => {
                canvasEle.hidden = false;
                canvasEle.setAttribute('data-testid', `core__canvas-layer-${pageIndex}`);
                plugins.forEach((plugin) => {
                    if (plugin.onCanvasLayerRender) {
                        plugin.onCanvasLayerRender({
                            ele: canvasEle,
                            pageIndex,
                            rotation,
                            scale,
                            status: LayerRenderStatus.DidRender,
                        });
                    }
                });
                onRenderCanvasCompleted();
            },
            (): void => {
                // Keep the canvas hidden to avoid black flickering
                // The issue only happens with React 18's Strict mode
                onRenderCanvasCompleted();
            }
        );

        return () => {
            if (canvasEle) {
                canvasEle.width = 0;
                canvasEle.height = 0;
            }
        };
    }, []);

    return (
        <div
            className="rpv-core__canvas-layer"
            style={{
                height: `${height}px`,
                width: `${width}px`,
            }}
        >
            <canvas ref={canvasLayerRef} />
        </div>
    );
};
