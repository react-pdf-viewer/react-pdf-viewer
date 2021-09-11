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
    pageIndex: number;
    store: Store<StoreProps>;
}> = ({ pageIndex, store }) => {
    const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument>();

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    // Support high DPI screen
    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvasRef = React.useRef<HTMLCanvasElement>();
    const containerRef = React.useRef<HTMLDivElement>();

    const [rendered, setRendered] = React.useState(false);

    React.useEffect(() => {
        if (!currentDoc) {
            return;
        }

        const containerEle = containerRef.current;
        const canvasEle = canvasRef.current;
        if (!containerEle || !canvasEle) {
            return;
        }

        currentDoc.getPage(pageIndex + 1).then((page) => {
            const viewport = page.getViewport({ scale: 1 });
            const w = viewport.width;
            const h = viewport.height;

            const containerWidth = containerEle.clientWidth;
            const containerHeight = containerEle.clientHeight;

            const scaled = Math.min(containerWidth / w, containerHeight / h);
            const canvasWidth = scaled * w;
            const canvasHeight = scaled * h;

            canvasEle.height = canvasHeight * devicePixelRatio;
            canvasEle.width = canvasWidth * devicePixelRatio;
            canvasEle.style.opacity = '0';

            const canvasContext = canvasEle.getContext('2d', {
                alpha: false,
            }) as CanvasRenderingContext2D;

            const renderViewport = page.getViewport({
                rotation: 0,
                scale: scaled * devicePixelRatio,
            });

            const renderTask = page.render({ canvasContext, viewport: renderViewport });
            renderTask.promise.then(
                (): void => {
                    setRendered(true);
                    canvasEle.style.removeProperty('opacity');
                },
                (): void => {
                    setRendered(true);
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
            {!rendered && (
                <div className="rpv-thumbnail__cover-loader">
                    <Spinner />
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    transform: `scale(${1 / devicePixelRatio})`,
                    transformOrigin: `top left`,
                }}
            />
        </div>
    );
};
