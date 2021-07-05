/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, SpecialZoomLevel, Spinner, Store, StoreHandler } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import BookmarkLoader from './BookmarkLoader';

const BookmarkListWithStore: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const [currentDoc, setCurrentDoc] = React.useState(store.get('doc'));

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    const jump = (pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel) => {
        const jumpToDestination = store.get('jumpToDestination');
        if (jumpToDestination) {
            jumpToDestination(pageIndex, bottomOffset, 0, scaleTo);
        }
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return currentDoc ? (
        <BookmarkLoader doc={currentDoc} onJumpToDest={jump} />
    ) : (
        <div className="rpv-bookmark__loader">
            <Spinner />
        </div>
    );
};

export default BookmarkListWithStore;
