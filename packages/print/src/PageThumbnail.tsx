/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs } from '@react-pdf-viewer/core';

export const PageThumbnail: React.FC<{
    canvas: HTMLCanvasElement;
    page: PdfJs.Page;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    onLoad(): void;
}> = ({ canvas, page, pageHeight, pageWidth, rotation, onLoad }) => {
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const [src, setSrc] = React.useState('');

    React.useEffect(() => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const printUnit = 150 / 72;
        canvas.height = Math.floor(pageHeight * printUnit);
        canvas.width = Math.floor(pageWidth * printUnit);

        const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasContext.save();
        canvasContext.fillStyle = 'rgb(255, 255, 255)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.restore();

        const viewport = page.getViewport({ rotation, scale: 1 });
        renderTask.current = page.render({
            canvasContext,
            intent: 'print',
            transform: [printUnit, 0, 0, printUnit, 0, 0],
            viewport,
        });
        renderTask.current.promise.then(
            () => {
                'toBlob' in canvas
                    ? canvas.toBlob((blob) => {
                          setSrc(URL.createObjectURL(blob));
                      })
                    : setSrc((canvas as HTMLCanvasElement).toDataURL());
            },
            () => {
                /**/
            }
        );
    }, []);

    return (
        src && (
            <div className="rpv-print__page">
                <img src={src} onLoad={() => onLoad()} />
            </div>
        )
    );
};
