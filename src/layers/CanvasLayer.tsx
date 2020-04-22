/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import './canvasLayer.less';
import WithScale from './WithScale';

interface CanvasLayerProps {
    height: number;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    width: number;
}

const CanvasLayer: React.FC<CanvasLayerProps> = ({ height, page, rotation, scale, width }) => {
    const theme = React.useContext(ThemeContent);
    const canvasRef = React.createRef<HTMLCanvasElement>();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

    // Support high DPI screen
    const devicePixelRatio = window.devicePixelRatio || 1;

    const renderCanvas = (): void => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvasEle = canvasRef.current as HTMLCanvasElement;
        const canvasContext = canvasEle.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

        const viewport = page.getViewport({ rotation, scale: scale * devicePixelRatio });
        renderTask.current = page.render({ canvasContext, viewport });
        renderTask.current.promise.then(
            (): void => {/**/},
            (): void => {/**/},
        );
    };

    return (
        <WithScale callback={renderCanvas} rotation={rotation} scale={scale}>
            <div
                className={`${theme.prefixClass}-canvas-layer`}
            >
            <canvas
                height={height * devicePixelRatio}
                ref={canvasRef}
                width={width * devicePixelRatio}
                style={{
                    transform: `scale(${1 / devicePixelRatio})`,
                    transformOrigin: `top left`,
                }}
            />
            </div>
        </WithScale>
    );
};

export default CanvasLayer;
