/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, SpecialZoomLevel, Store } from '@react-pdf-viewer/core';

import BookmarkList from './BookmarkList';
import StoreProps from './StoreProps';

interface BookmarkListRootProps {
    bookmarks: PdfJs.Outline[];
    doc: PdfJs.PdfDocument;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkListRoot: React.FC<BookmarkListRootProps> = ({ bookmarks, doc, store, onJumpToDest }) => {
    const updateLinkAnnotation = (bookmark: PdfJs.Outline, links: Record<string, HTMLElement>): void => {
        const dest = bookmark.dest;
        if (!dest || typeof dest !== 'string' || !links[dest]) {
            return;
        }
        const annotationContainer = links[dest];
        annotationContainer.querySelectorAll(`a[data-annotation-link-dest="${dest}"]`).forEach((node) => {
            node.setAttribute('aria-label', bookmark.title);
        });

        // Loop over the child bookmarks
        if (!bookmark.items || !bookmark.items.length) {
            return;
        }
        bookmark.items.forEach((item) => updateLinkAnnotation(item, links));
    };

    const handleLinkAnnotationsChanged = (links: Record<string, HTMLElement>): void => {
        bookmarks.forEach((bookmark) => updateLinkAnnotation(bookmark, links));
    };

    React.useEffect(() => {
        store.subscribe('linkAnnotations', handleLinkAnnotationsChanged);

        return () => {
            store.unsubscribe('linkAnnotations', handleLinkAnnotationsChanged);
        };
    }, []);

    return <BookmarkList bookmarks={bookmarks} depth={0} doc={doc} store={store} onJumpToDest={onJumpToDest} />;
};

export default BookmarkListRoot;
