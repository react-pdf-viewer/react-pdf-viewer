/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../PdfJs';
import WithScale from '../WithScale';

interface CanvasLayerProps {
    height: number;
    page: PdfJs.Page;
    rotation: number;
    scale: number;
    width: number;
}

const CanvasLayer: React.FC<CanvasLayerProps> = ({ height, page, rotation, scale, width }) => {
    const canvasRef = React.createRef<HTMLCanvasElement>();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

    const renderCanvas = () => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvasEle = canvasRef.current as HTMLCanvasElement;
        const canvasContext = canvasEle.getContext('2d') as CanvasRenderingContext2D;

        const viewport = page.getViewport({ rotation, scale });
        renderTask.current = page.render({ canvasContext, viewport });
        renderTask.current.promise.then(
            (_) => {/**/},
            (_) => {/**/},
        );
    };

    return (
        <WithScale callback={renderCanvas} rotation={rotation} scale={scale}>
            <canvas
                height={height}
                ref={canvasRef}
                style={{
                    left: '0',
                    position: 'absolute',
                    top: '0',
                }}
                width={width}
            />
        </WithScale>
    );
};

export default CanvasLayer;
