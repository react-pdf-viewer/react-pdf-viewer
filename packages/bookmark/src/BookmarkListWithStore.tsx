/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useEffect, useState } from 'react';
import { PdfJs, SpecialZoomLevel, Spinner, Store, StoreHandler } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';
import BookmarkLoader from './BookmarkLoader';
import './bookmarkListLoader.less';

const BookmarkListWithStore: React.FC<{
    store: Store<StoreProps>,
}> = ({ store }) => {
    const [currentDoc, setCurrentDoc] = useState(store.get('doc'));

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    const jump = (pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel) => {
        const jumpToDestination = store.get('jumpToDestination');
        if (jumpToDestination) {
            jumpToDestination(pageIndex, bottomOffset, scaleTo);
        }
    };

    useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return (
        currentDoc 
        ? (
            <BookmarkLoader
                doc={currentDoc}
                onJumpToDest={jump}
            />
        )
        : <div className='rpv-bookmark-list-loader'><Spinner /></div>
    );
};

export default BookmarkListWithStore;
