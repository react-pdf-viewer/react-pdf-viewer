/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Spinner, Store, StoreHandler } from '@react-pdf-viewer/core';

import { StoreProps } from './types/StoreProps';

export const Cover: React.FC<{
    getPageIndex?({ numPages }: { numPages: number }): number;
    renderSpinner?: () => React.ReactElement;
    store: Store<StoreProps>;
}> = ({ getPageIndex, renderSpinner, store }) => {
    const [src, setSrc] = React.useState('');
    const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument>();

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    // Support high DPI screen
    const devicePixelRatio = window.devicePixelRatio || 1;
    const containerRef = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
        if (!currentDoc) {
            return;
        }

        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        const { numPages } = currentDoc;
        const targetPage = getPageIndex ? getPageIndex({ numPages }) : 0;
        const normalizePage = Math.max(0, Math.min(targetPage, numPages - 1));
        currentDoc.getPage(normalizePage + 1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const w = viewport.width;
            const h = viewport.height;

            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            const canvasContext = canvas.getContext('2d', {
                alpha: false,
            }) as CanvasRenderingContext2D;

            const containerWidth = containerEle.clientWidth;
            const containerHeight = containerEle.clientHeight;

            const scaled = Math.min(containerWidth / w, containerHeight / h);
            const canvasWidth = scaled * w * devicePixelRatio;
            const canvasHeight = scaled * h * devicePixelRatio;

            canvas.height = canvasHeight;
            canvas.width = canvasWidth;
            canvas.style.opacity = '0';

            const renderViewport = page.getViewport({
                rotation: 0,
                scale: scaled * devicePixelRatio,
            });

            const renderTask = page.render({ canvasContext, viewport: renderViewport });
            renderTask.promise.then(
                (): void => setSrc(canvas.toDataURL()),
                (): void => {
                    /**/
                }
            );
        });
    }, [currentDoc]);

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return (
        <div className="rpv-thumbnail__cover" ref={containerRef}>
            {!src ? (
                <div className="rpv-thumbnail__cover-loader">{renderSpinner ? renderSpinner() : <Spinner />}</div>
            ) : (
                <img className="rpv-thumbnail__cover-image" data-testid="thumbnail__cover-image" src={src} />
            )}
        </div>
    );
};
