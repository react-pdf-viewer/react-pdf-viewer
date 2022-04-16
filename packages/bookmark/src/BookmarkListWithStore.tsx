/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { SpecialZoomLevel, Spinner } from '@react-pdf-viewer/core';
import type { PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core';

import { BookmarkLoader } from './BookmarkLoader';
import type { IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import type { StoreProps } from './types/StoreProps';

export const BookmarkListWithStore: React.FC<{
    isBookmarkExpanded: IsBookmarkExpanded;
    store: Store<StoreProps>;
}> = ({ isBookmarkExpanded, store }) => {
    const [currentDoc, setCurrentDoc] = React.useState(store.get('doc'));

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    const jump = (pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel) => {
        const jumpToDestination = store.get('jumpToDestination');
        if (jumpToDestination) {
            jumpToDestination(pageIndex, bottomOffset, leftOffset, scaleTo);
        }
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return currentDoc ? (
        <BookmarkLoader doc={currentDoc} isBookmarkExpanded={isBookmarkExpanded} store={store} onJumpToDest={jump} />
    ) : (
        <div className="rpv-bookmark__loader">
            <Spinner />
        </div>
    );
};
