/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { Spinner } from '../components/Spinner';
import { useIsMounted } from '../hooks/useIsMounted';
import { LayerRenderStatus } from '../structs/LayerRenderStatus';
import { floatToRatio } from '../utils/floatToRatio';
import { roundToDivide } from '../utils/roundToDivide';
import { WithScale } from './WithScale';
import type { PdfJs } from '../types/PdfJs';
import type { Plugin } from '../types/Plugin';

// The mobile browsers have the limit value for maximum canvas size
// The values vary but here we set a maximum value of 16 mega-pixels
const MAX_CANVAS_SIZE = 4096 * 4096;

export const CanvasLayer: React.FC<{
    height: number;
    page: PdfJs.Page;
    pageIndex: number;
    plugins: Plugin[];
    rotation: number;
    scale: number;
    width: number;
}> = ({ height, page, pageIndex, plugins, rotation, scale, width }) => {
    const isMounted = useIsMounted();
    const canvasRef = React.useRef<HTMLCanvasElement>();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

    const [rendered, setRendered] = React.useState(false);

    const renderCanvas = (): void => {
        setRendered(false);

        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvasEle = canvasRef.current as HTMLCanvasElement;

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
        canvasEle.style.opacity = '0';

        const canvasContext = canvasEle.getContext('2d', {
            alpha: false,
        }) as CanvasRenderingContext2D;

        const transform = shouldScaleByCSS || outputScale !== 1 ? [possibleScale, 0, 0, possibleScale, 0, 0] : null;
        renderTask.current = page.render({ canvasContext, transform, viewport });
        renderTask.current.promise.then(
            (): void => {
                isMounted.current && setRendered(true);
                canvasEle.style.removeProperty('opacity');
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
            },
            (): void => {
                isMounted.current && setRendered(true);
            }
        );
    };

    return (
        <WithScale callback={renderCanvas} rotation={rotation} scale={scale}>
            <div
                className="rpv-core__canvas-layer"
                style={{
                    height: `${height}px`,
                    width: `${width}px`,
                }}
            >
                {!rendered && (
                    <div className="rpv-core__canvas-layer-loader">
                        <Spinner />
                    </div>
                )}
                <canvas ref={canvasRef} />
            </div>
        </WithScale>
    );
};
