/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Spinner, useIsomorphicLayoutEffect } from '@react-pdf-viewer/core';
import type { PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core/lib';

import StoreProps from './StoreProps';
import ThumbnailList from './ThumbnailList';

const ThumbnailListWithStore: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const [currentDoc, setCurrentDoc] = React.useState(store.get('doc'));
    const [currentPage, setCurrentPage] = React.useState(store.get('currentPage') || 0);
    const [pageHeight, setPageHeight] = React.useState(store.get('pageHeight') || 0);
    const [pageWidth, setPageWidth] = React.useState(store.get('pageWidth') || 0);
    const [rotation, setRotation] = React.useState(store.get('rotation') || 0);

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

    const jump = (pageIndex: number) => {
        const jumpToPage = store.get('jumpToPage');
        if (jumpToPage) {
            jumpToPage(pageIndex);
        }
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);
        store.subscribe('pageHeight', handlePageHeightChanged);
        store.subscribe('pageWidth', handlePageWidthChanged);
        store.subscribe('rotation', handleRotationChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
            store.unsubscribe('pageHeight', handlePageHeightChanged);
            store.unsubscribe('pageWidth', handlePageWidthChanged);
            store.unsubscribe('rotation', handleRotationChanged);
        };
    }, []);

    useIsomorphicLayoutEffect(() => {
        store.subscribe('currentPage', handleCurrentPageChanged);

        return () => {
            store.unsubscribe('currentPage', handleCurrentPageChanged);
        };
    }, []);

    return currentDoc ? (
        <ThumbnailList
            currentPage={currentPage}
            doc={currentDoc}
            pageHeight={pageHeight}
            pageWidth={pageWidth}
            rotation={rotation}
            onJumpToPage={jump}
        />
    ) : (
        <div className="rpv-thumbnail__loader">
            <Spinner />
        </div>
    );
};

export default ThumbnailListWithStore;
