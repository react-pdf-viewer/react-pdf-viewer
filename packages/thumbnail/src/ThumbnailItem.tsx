/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Spinner } from '@react-pdf-viewer/core';

interface ThumbnailItemProps {
    page: PdfJs.Page;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    thumbnailHeight: number;
    thumbnailWidth: number;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({
    page, pageHeight, pageWidth, rotation, thumbnailHeight, thumbnailWidth,
}) => {
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const [src, setSrc] = React.useState('');

    React.useEffect(() => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const canvasContext = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

        const w = thumbnailWidth;
        const h = w / (pageWidth / pageHeight);
        const scale = w / pageWidth;

        canvas.height = h;
        canvas.width = w;
        canvas.style.height = `${h}px`;
        canvas.style.width = `${w}px`;

        const viewport = page.getViewport({ rotation, scale });
        renderTask.current = page.render({ canvasContext, viewport });
        renderTask.current.promise.then(
            () => setSrc(canvas.toDataURL()),
            () => {/**/},
        );
    }, [rotation]);

    return (
        !src
            ? <Spinner />
            : <img src={src} height={`${thumbnailHeight}px`} width={`${thumbnailWidth}px`} />
    );
};

export default ThumbnailItem;
