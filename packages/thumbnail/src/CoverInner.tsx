/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, Store, StoreHandler, VisibilityChanged } from '@react-pdf-viewer/core';
import { getPage, Spinner, useIntersectionObserver, useIsMounted } from '@react-pdf-viewer/core';
import * as React from 'react';
import { StoreProps } from './types/StoreProps';

export const CoverInner: React.FC<{
    doc: PdfJs.PdfDocument;
    getPageIndex?({ numPages }: { numPages: number }): number;
    renderSpinner?: () => React.ReactElement;
    store: Store<StoreProps>;
    width?: number;
}> = ({ doc, getPageIndex, renderSpinner, store, width }) => {
    const { numPages } = doc;
    const targetPage = getPageIndex ? getPageIndex({ numPages }) : 0;
    const normalizePage = Math.max(0, Math.min(targetPage, numPages - 1));

    const initialPagesRotation = store.get('pagesRotation') || new Map();
    const initialTargetPageRotation = initialPagesRotation.has(normalizePage)
        ? initialPagesRotation.get(normalizePage)
        : 0;

    const [src, setSrc] = React.useState('');
    const isMounted = useIsMounted();
    const renderTask = React.useRef<PdfJs.PageRenderTask>();
    const [rotation, setRotation] = React.useState(store.get('rotation') || 0);
    const [pageRotation, setPageRotation] = React.useState(initialTargetPageRotation);

    const [isVisible, setVisible] = React.useState(false);

    const handlePagesRotationChanged: StoreHandler<Map<number, number>> = (rotations: Map<number, number>) => {
        const pageRotation = rotations.has(normalizePage) ? rotations.get(normalizePage) : 0;
        setPageRotation(pageRotation);
    };

    const handleRotationChanged: StoreHandler<number> = (currentRotation: number) => {
        setRotation(currentRotation);
    };

    const handleVisibilityChanged = (params: VisibilityChanged): void => {
        setVisible(params.isVisible);
    };

    const containerRef = useIntersectionObserver({
        onVisibilityChanged: handleVisibilityChanged,
    });

    React.useEffect(() => {
        if (!isVisible) {
            return;
        }
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        setSrc('');
        getPage(doc, normalizePage).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const viewportRotation = viewport.rotation;

            // To support the document which is already rotated
            const rotationValue = (viewportRotation + rotation + pageRotation) % 360;

            const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
            const w = isVertical ? viewport.width : viewport.height;
            const h = isVertical ? viewport.height : viewport.width;

            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext('2d', { alpha: false });

            const containerWidth = containerEle.clientWidth;
            const containerHeight = containerEle.clientHeight;

            const scaled = width ? width / w : Math.min(containerWidth / w, containerHeight / h);
            const canvasWidth = scaled * w;
            const canvasHeight = scaled * h;

            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
            canvas.style.opacity = '0';

            const renderViewport = page.getViewport({
                rotation: rotationValue,
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
    }, [pageRotation, isVisible]);

    React.useEffect(() => {
        store.subscribe('pagesRotation', handlePagesRotationChanged);
        store.subscribe('rotation', handleRotationChanged);

        return () => {
            store.unsubscribe('pagesRotation', handlePagesRotationChanged);
            store.unsubscribe('rotation', handleRotationChanged);
        };
    }, []);

    React.useEffect(() => {
        return () => {
            renderTask.current?.cancel();
        };
    }, []);

    return (
        <div ref={containerRef} className="rpv-thumbnail__cover-inner" data-testid="thumbnail__cover-inner">
            {src ? (
                <img className="rpv-thumbnail__cover-image" data-testid="thumbnail__cover-image" src={src} />
            ) : (
                <div className="rpv-thumbnail__cover-loader" data-testid="thumbnail__cover-loader">
                    {renderSpinner ? renderSpinner() : <Spinner />}
                </div>
            )}
        </div>
    );
};
