/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs } from '@react-pdf-viewer/core';
import { useIsMounted } from '@react-pdf-viewer/core';
import * as React from 'react';
import { isRunningInJest } from './isRunningInJest';

export const PageThumbnail: React.FC<{
    canvas: HTMLCanvasElement;
    page: PdfJs.Page;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
    onLoad(): void;
}> = ({ canvas, page, pageHeight, pageIndex, pageWidth, rotation, onLoad }) => {
    const isMounted = useIsMounted();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const [src, setSrc] = React.useState('');
    const testWithJest = React.useMemo(() => isRunningInJest(), []);

    const handleImageLoad = () => {
        // The `onload` event isn't triggered in Jest environment
        if (!testWithJest) {
            onLoad();
        }
    };

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
                // `URL.createObjectURL` is not available in jest-dom yet
                if ('toBlob' in canvas && 'createObjectURL' in URL) {
                    canvas.toBlob((blob) => {
                        isMounted.current && setSrc(URL.createObjectURL(blob));
                        testWithJest && onLoad();
                    });
                } else {
                    isMounted.current && setSrc(canvas.toDataURL());
                    testWithJest && onLoad();
                }
            },
            () => {
                /**/
            }
        );
    }, []);

    return (
        src && (
            <div className="rpv-print__page">
                <img data-testid={`print__thumbnail-${pageIndex}`} src={src} onLoad={handleImageLoad} />
            </div>
        )
    );
};
