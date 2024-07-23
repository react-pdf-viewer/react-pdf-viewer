/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type PageSize, type PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { PageThumbnailContainer } from './PageThumbnailContainer';
import { PrintStatus } from './structs/PrintStatus';
import styles from './styles/printZone.module.css';

export const PrintZone: React.FC<{
    doc: PdfJs.PdfDocument;
    numLoadedPages: number;
    pagesRotation: Map<number, number>;
    pageSizes: PageSize[];
    printPages: number[];
    printStatus: PrintStatus;
    rotation: number;
    onCancel(): void;
    onLoad(): void;
}> = ({ doc, numLoadedPages, pagesRotation, pageSizes, printPages, printStatus, rotation, onCancel, onLoad }) => {
    const canvas = React.useMemo(() => document.createElement('canvas') as HTMLCanvasElement, []);

    const container = React.useMemo(() => {
        const zoneEle = document.querySelector(`.${styles.zone}`);
        if (zoneEle) {
            return zoneEle;
        }

        const div = document.createElement('div');
        div.classList.add(styles.zone);
        div.setAttribute('data-testid', 'print__zone');
        document.body.appendChild(div);
        return div;
    }, []);

    React.useEffect(() => {
        if (printStatus === PrintStatus.Ready) {
            document.documentElement.classList.add(styles.htmlPrinting);
            document.body.classList.add(styles.bodyPrinting);
            window.print();
        }

        // Handle the case user clicks the `Cancel` button in the print window
        const handler = (): void => {
            if (printStatus === PrintStatus.Ready) {
                document.documentElement.classList.remove(styles.htmlPrinting);
                document.body.classList.remove(styles.bodyPrinting);

                // Remove the container
                const zones = document.querySelectorAll(`.${styles.zone}`);
                if (zones) {
                    zones.forEach((zoneEle) => {
                        zoneEle.parentElement?.removeChild(zoneEle);
                    });
                }

                // Cleanup
                canvas.height = 0;
                canvas.width = 0;

                // Remove the handler
                document.removeEventListener('mousemove', handler);

                onCancel();
            }
        };
        document.addEventListener('mousemove', handler);

        return (): void => document.removeEventListener('mousemove', handler);
    }, [printStatus]);

    // Don't append the pages to the `body` directly
    // Otherwise, it will cause a weird issue such as we can't open any popover
    const pageHeight = pageSizes[0].pageHeight;
    const pageWidth = pageSizes[0].pageWidth;

    return createPortal(
        <>
            {printPages.map((pageIndex, loopIndex) => (
                <PageThumbnailContainer
                    key={pageIndex}
                    canvas={canvas}
                    doc={doc}
                    pageIndex={pageIndex}
                    pageRotation={pagesRotation.has(pageIndex) ? pagesRotation.get(pageIndex)! : 0}
                    pageSize={pageSizes[pageIndex]}
                    rotation={rotation}
                    shouldRender={loopIndex === numLoadedPages}
                    onLoad={onLoad}
                />
            ))}
            <style
                dangerouslySetInnerHTML={{
                    __html: `@page { size: ${pageWidth}pt ${pageHeight}pt }`,
                }}
            ></style>
        </>,
        container,
    );
};
