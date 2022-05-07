/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core';
import { LazyRender, RotateDirection, useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import * as React from 'react';
import { SpinnerContext } from './SpinnerContext';
import { ThumbnailList } from './ThumbnailList';
import type { RenderCurrentPageLabel } from './types/RenderCurrentPageLabelProps';
import type { RenderThumbnailItem } from './types/RenderThumbnailItemProps';
import type { StoreProps } from './types/StoreProps';

export const ThumbnailListWithStore: React.FC<{
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    renderThumbnailItem?: RenderThumbnailItem;
    store: Store<StoreProps>;
    thumbnailWidth: number;
}> = ({ renderCurrentPageLabel, renderThumbnailItem, store, thumbnailWidth }) => {
    const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument>(store.get('doc'));
    const [currentPage, setCurrentPage] = React.useState(store.get('currentPage') || 0);
    const [pageHeight, setPageHeight] = React.useState(store.get('pageHeight') || 0);
    const [pageWidth, setPageWidth] = React.useState(store.get('pageWidth') || 0);
    const [rotation, setRotation] = React.useState(store.get('rotation') || 0);
    const [pagesRotation, setPagesRotation] = React.useState(store.get('pagesRotation') || new Map());
    const [rotatedPage, setRotatedPage] = React.useState(store.get('rotatedPage') || -1);

    const handleCurrentPageChanged: StoreHandler<number> = (currentPageIndex: number) => {
        setCurrentPage(currentPageIndex);
    };

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    const handlePageHeightChanged: StoreHandler<number> = (height: number) => {
        setPageHeight(height);
    };

    const handlePageWidthChanged: StoreHandler<number> = (width: number) => {
        setPageWidth(width);
    };

    const handleRotationChanged: StoreHandler<number> = (currentRotation: number) => {
        setRotation(currentRotation);
    };

    const handlePagesRotationChanged: StoreHandler<Map<number, number>> = (rotations: Map<number, number>) => {
        setPagesRotation(rotations);
    };

    const handleRotatedPage: StoreHandler<number> = (rotatedPage: number) => {
        setRotatedPage(rotatedPage);
    };

    const jump = (pageIndex: number) => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(pageIndex);
        }
    };

    const rotatePage = (pageIndex: number, direction: RotateDirection) => {
        store.get('rotatePage')(pageIndex, direction);
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);
        store.subscribe('pageHeight', handlePageHeightChanged);
        store.subscribe('pageWidth', handlePageWidthChanged);
        store.subscribe('rotatedPage', handleRotatedPage);
        store.subscribe('rotation', handleRotationChanged);
        store.subscribe('pagesRotation', handlePagesRotationChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
            store.unsubscribe('pageHeight', handlePageHeightChanged);
            store.unsubscribe('pageWidth', handlePageWidthChanged);
            store.unsubscribe('rotatedPage', handleRotatedPage);
            store.unsubscribe('rotation', handleRotationChanged);
            store.unsubscribe('pagesRotation', handlePagesRotationChanged);
        };
    }, []);

    useIsomorphicLayoutEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
        };
    }, []);

    return currentDoc ? (
        <LazyRender
            testId="thumbnail__list-container"
            attrs={{
                className: 'rpv-thumbnail__list-container',
            }}
        >
            <ThumbnailList
                currentPage={currentPage}
                doc={currentDoc}
                pagesRotation={pagesRotation}
                pageHeight={pageHeight}
                pageWidth={pageWidth}
                renderCurrentPageLabel={renderCurrentPageLabel}
                renderThumbnailItem={renderThumbnailItem}
                rotatedPage={rotatedPage}
                rotation={rotation}
                thumbnailWidth={thumbnailWidth}
                onJumpToPage={jump}
                onRotatePage={rotatePage}
            />
        </LazyRender>
    ) : (
        <div data-testid="thumbnail-list__loader" className="rpv-thumbnail__loader">
            {React.useContext(SpinnerContext).renderSpinner()}
        </div>
    );
};
