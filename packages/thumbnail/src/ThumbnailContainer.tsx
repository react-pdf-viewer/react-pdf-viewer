/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIntersectionObserver, Spinner } from '@react-pdf-viewer/core';
import type { PdfJs, VisibilityChanged } from '@react-pdf-viewer/core';

import { SpinnerContext } from './SpinnerContext';
import { ThumbnailItem } from './ThumbnailItem';

const THUMBNAIL_WIDTH = 100;

interface PageState {
    height: number;
    isCalculated: boolean;
    page: PdfJs.Page | null;
    viewportRotation: number;
    width: number;
}

export const ThumbnailContainer: React.FC<{
    doc: PdfJs.PdfDocument;
    isActive: boolean;
    pageHeight: number;
    pageIndex: number;
    pageWidth: number;
    rotation: number;
    onActive(target: HTMLElement): void;
}> = ({ doc, isActive, pageHeight, pageIndex, pageWidth, rotation, onActive }) => {
    const [pageSize, setPageSize] = React.useState<PageState>({
        height: pageHeight,
        isCalculated: false,
        page: null,
        viewportRotation: 0,
        width: pageWidth,
    });
    const visibilityRef = React.useRef<VisibilityChanged>({
        isVisible: false,
        ratio: 0,
    });
    const { isCalculated, page, height, width } = pageSize;

    const scale = width / height;
    const isVertical = Math.abs(rotation) % 180 === 0;
    const w = isVertical ? THUMBNAIL_WIDTH : THUMBNAIL_WIDTH / scale;
    const h = isVertical ? THUMBNAIL_WIDTH / scale : THUMBNAIL_WIDTH;

    React.useLayoutEffect(() => {
        if (!isActive) {
            return;
        }
        const ele = containerRef.current;
        const visibility = visibilityRef.current;
        if (!visibility.isVisible || visibility.ratio < 1) {
            onActive(ele);
        }
    }, [isActive]);

    const onVisibilityChanged = (params: VisibilityChanged): void => {
        visibilityRef.current = params;
        if (params.isVisible && !isCalculated) {
            doc.getPage(pageIndex + 1).then((pdfPage) => {
                const viewport = pdfPage.getViewport({ scale: 1 });

                setPageSize({
                    height: viewport.height,
                    isCalculated: true,
                    page: pdfPage,
                    viewportRotation: viewport.rotation,
                    width: viewport.width,
                });
            });
        }
    };

    // To support the document which is already rotated
    const rotationNumber = (rotation + pageSize.viewportRotation) % 360;

    const containerRef = useIntersectionObserver({
        onVisibilityChanged,
    });

    return (
        <div
            className="rpv-thumbnail__container"
            ref={containerRef}
            style={{
                height: `${h}px`,
                width: `${w}px`,
            }}
        >
            {!page ? (
                React.useContext(SpinnerContext).renderSpinner
            ) : (
                <ThumbnailItem
                    page={page}
                    pageHeight={isVertical ? height : width}
                    pageIndex={pageIndex}
                    pageWidth={isVertical ? width : height}
                    rotation={rotationNumber}
                    thumbnailHeight={h}
                    thumbnailWidth={w}
                />
            )}
        </div>
    );
};
