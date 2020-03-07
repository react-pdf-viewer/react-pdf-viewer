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

    const renderCanvas = (): void => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvasEle = canvasRef.current as HTMLCanvasElement;
        const canvasContext = canvasEle.getContext('2d') as CanvasRenderingContext2D;

        const viewport = page.getViewport({ rotation, scale });
        renderTask.current = page.render({ canvasContext, viewport });
        renderTask.current.promise.then(
            (): void => {/**/},
            (): void => {/**/},
        );
    };

    return (
        <WithScale callback={renderCanvas} rotation={rotation} scale={scale}>
            <canvas
                className={`${theme.prefixClass}-canvas-layer`}
                height={height}
                ref={canvasRef}
                width={width}
            />
        </WithScale>
    );
};

export default CanvasLayer;
