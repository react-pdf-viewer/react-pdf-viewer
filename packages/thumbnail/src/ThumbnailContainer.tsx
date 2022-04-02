/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { getPage, useIntersectionObserver } from '@react-pdf-viewer/core';
import type { PdfJs, VisibilityChanged } from '@react-pdf-viewer/core';

import { SpinnerContext } from './SpinnerContext';
import { ThumbnailItem } from './ThumbnailItem';

const THUMBNAIL_WIDTH = 100;

interface PageState {
    height: number;
    page: PdfJs.Page | null;
    viewportRotation: number;
    width: number;
}

export const ThumbnailContainer: React.FC<{
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageIndex: number;
    pageRotation: number;
    pageWidth: number;
    rotation: number;
    shouldRender: boolean;
    onRenderCompleted: (pageIndex: number) => void;
    onVisibilityChanged(pageIndex: number, visibility: VisibilityChanged): void;
}> = ({
    doc,
    pageHeight,
    pageIndex,
    pageRotation,
    pageWidth,
    rotation,
    shouldRender,
    onRenderCompleted,
    onVisibilityChanged,
}) => {
    const [pageSize, setPageSize] = React.useState<PageState>({
        height: pageHeight,
        page: null,
        viewportRotation: 0,
        width: pageWidth,
    });
    const { page, height, width } = pageSize;

    const scale = width / height;
    const isVertical = Math.abs(rotation + pageRotation) % 180 === 0;
    const w = isVertical ? THUMBNAIL_WIDTH : THUMBNAIL_WIDTH / scale;
    const h = isVertical ? THUMBNAIL_WIDTH / scale : THUMBNAIL_WIDTH;

    React.useEffect(() => {
        if (shouldRender) {
            getPage(doc, pageIndex).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });
                setPageSize({
                    height: viewport.height,
                    page: pdfPage,
                    viewportRotation: viewport.rotation,
                    width: viewport.width,
                });
            });
        }
    }, [shouldRender]);

    // To support the document which is already rotated
    const rotationNumber = (pageSize.viewportRotation + rotation + pageRotation) % 360;

    const containerRef = useIntersectionObserver({
        onVisibilityChanged: (visibility) => {
            onVisibilityChanged(pageIndex, visibility);
        },
    });

    return (
        <div
            className="rpv-thumbnail__container"
            data-testid={`thumbnail__container-${pageIndex}`}
            ref={containerRef}
            style={{
                height: `${h}px`,
                width: `${w}px`,
            }}
        >
            {!page ? (
                React.useContext(SpinnerContext).renderSpinner()
            ) : (
                <ThumbnailItem
                    page={page}
                    pageHeight={isVertical ? height : width}
                    pageIndex={pageIndex}
                    pageWidth={isVertical ? width : height}
                    rotation={rotationNumber}
                    thumbnailHeight={h}
                    thumbnailWidth={w}
                    onRenderCompleted={onRenderCompleted}
                />
            )}
        </div>
    );
};
