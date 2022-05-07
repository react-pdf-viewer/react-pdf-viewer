/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, VisibilityChanged } from '@react-pdf-viewer/core';
import { getPage, Spinner, useIntersectionObserver, useIsMounted } from '@react-pdf-viewer/core';
import * as React from 'react';

export const CoverInner: React.FC<{
    getPageIndex?({ numPages }: { numPages: number }): number;
    renderSpinner?: () => React.ReactElement;
    doc: PdfJs.PdfDocument;
}> = ({ getPageIndex, renderSpinner, doc }) => {
    const [src, setSrc] = React.useState('');
    const isMounted = useIsMounted();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();

    const handleVisibilityChanged = (params: VisibilityChanged): void => {
        if (src || !params.isVisible) {
            return;
        }
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        const { numPages } = doc;
        const targetPage = getPageIndex ? getPageIndex({ numPages }) : 0;
        const normalizePage = Math.max(0, Math.min(targetPage, numPages - 1));
        getPage(doc, normalizePage).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const w = viewport.width;
            const h = viewport.height;

            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext('2d', { alpha: false });

            const containerWidth = containerEle.clientWidth;
            const containerHeight = containerEle.clientHeight;

            const scaled = Math.min(containerWidth / w, containerHeight / h);
            const canvasWidth = scaled * w;
            const canvasHeight = scaled * h;

            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
            canvas.style.opacity = '0';

            const renderViewport = page.getViewport({
                rotation: 0,
                scale: scaled,
            });

            renderTask.current = page.render({ canvasContext, viewport: renderViewport });
            renderTask.current.promise.then(
                (): void => {
                    isMounted.current && setSrc(canvas.toDataURL());
                    canvas.width = 0;
                    canvas.height = 0;
                },
                (): void => {
                    /**/
                }
            );
        });
    };

    const containerRef = useIntersectionObserver({
        onVisibilityChanged: handleVisibilityChanged,
    });

    React.useEffect(() => {
        return () => {
            renderTask.current?.cancel();
        };
    }, []);

    return src ? (
        <img className="rpv-thumbnail__cover-image" data-testid="thumbnail__cover-image" src={src} />
    ) : (
        <div className="rpv-thumbnail__cover-loader" data-testid="thumbnail__cover-loader" ref={containerRef}>
            {renderSpinner ? renderSpinner() : <Spinner />}
        </div>
    );
};
