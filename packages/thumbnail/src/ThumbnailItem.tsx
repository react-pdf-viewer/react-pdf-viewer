/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { LocalizationContext, type LocalizationMap, type PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SpinnerContext } from './SpinnerContext';

export const ThumbnailItem: React.FC<{
    page: PdfJs.Page;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
    thumbnailHeight: number;
    thumbnailWidth: number;
    onRenderCompleted: (pageIndex: number) => void;
}> = ({ page, pageHeight, pageIndex, pageWidth, rotation, thumbnailHeight, thumbnailWidth, onRenderCompleted }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const [src, setSrc] = React.useState('');

    const thumbnailLabel =
        l10n && l10n.thumbnail
            ? ((l10n.thumbnail as LocalizationMap).thumbnailLabel as string)
            : 'Thumbnail of page {{pageIndex}}';

    React.useEffect(() => {
        const task = renderTask.current;
        if (task) {
            task.cancel();
        }

        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d', { alpha: false });

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
            () => {
                setSrc(canvas.toDataURL());
                onRenderCompleted(pageIndex);
            },
            () => {
                onRenderCompleted(pageIndex);
            },
        );

        return () => {
            renderTask.current?.cancel();
        };
    }, [rotation]);

    return !src ? (
        React.useContext(SpinnerContext).renderSpinner()
    ) : (
        <img
            aria-label={thumbnailLabel.replace('{{pageIndex}}', `${pageIndex + 1}`)}
            src={src}
            height={`${thumbnailHeight}px`}
            width={`${thumbnailWidth}px`}
        />
    );
};
