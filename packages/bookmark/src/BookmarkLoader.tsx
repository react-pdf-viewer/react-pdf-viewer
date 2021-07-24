/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, SpecialZoomLevel, Spinner } from '@react-pdf-viewer/core';
import type { PdfJs, Store } from '@react-pdf-viewer/core/lib';

import BookmarkListRoot from './BookmarkListRoot';
import StoreProps from './StoreProps';

interface BookmarkLoaderProps {
    doc: PdfJs.PdfDocument;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}
interface BookmarkState {
    isLoaded: boolean;
    items: PdfJs.Outline[];
}

const BookmarkLoader: React.FC<BookmarkLoaderProps> = ({ doc, store, onJumpToDest }) => {
    const l10n = React.useContext(LocalizationContext);
    const [bookmarks, setBookmarks] = React.useState<BookmarkState>({
        isLoaded: false,
        items: [],
    });

    React.useEffect(() => {
        setBookmarks({
            isLoaded: false,
            items: [],
        });
        doc.getOutline().then((outline) => {
            setBookmarks({
                isLoaded: true,
                items: outline || [],
            });
        });
    }, [doc]);

    return !bookmarks.isLoaded ? (
        <Spinner />
    ) : bookmarks.items.length === 0 ? (
        <div className="rpv-bookmark__empty">
            {l10n && l10n.bookmark ? l10n.bookmark.noBookmark : 'There is no bookmark'}
        </div>
    ) : (
        <div className="rpv-bookmark__container">
            <BookmarkListRoot bookmarks={bookmarks.items} doc={doc} store={store} onJumpToDest={onJumpToDest} />
        </div>
    );
};

export default BookmarkLoader;
