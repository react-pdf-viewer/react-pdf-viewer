/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, Spinner } from '@react-pdf-viewer/core';
import type { PdfJs } from '@react-pdf-viewer/core';

export const ThumbnailItem: React.FC<{
    page: PdfJs.Page;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
    thumbnailHeight: number;
    thumbnailWidth: number;
}> = ({
    page,
    pageHeight,
    pageIndex,
    pageWidth,
    rotation,
    thumbnailHeight,
    thumbnailWidth,
}) => {
    const l10n = React.useContext(LocalizationContext);
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const [src, setSrc] = React.useState('');

    const thumbnailLabel = (
        l10n && l10n.thumbnail ? l10n.thumbnail.thumbnailLabel : 'Thumbnail of page {{pageIndex}}'
    ) as string;

    React.useEffect(() => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const canvasContext = canvas.getContext('2d', {
            alpha: false,
        }) as CanvasRenderingContext2D;

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
            () => {
                /**/
            }
        );
    }, [rotation]);

    return !src ? (
        <Spinner />
    ) : (
        <img
            aria-label={thumbnailLabel.replace('{{pageIndex}}', `${pageIndex + 1}`)}
            src={src}
            height={`${thumbnailHeight}px`}
            width={`${thumbnailWidth}px`}
        />
    );
};
