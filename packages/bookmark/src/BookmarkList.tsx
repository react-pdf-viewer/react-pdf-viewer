/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { getDestination, PdfJs, SpecialZoomLevel, Store } from '@react-pdf-viewer/core';

import BookmarkItem from './BookmarkItem';
import StoreProps from './StoreProps';

interface BookmarkListProps {
    bookmarks: PdfJs.Outline[];
    depth: number;
    doc: PdfJs.PdfDocument;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, depth = 0, doc, store, onJumpToDest }) => {
    const jumpToDest = (dest: PdfJs.OutlineDestinationType): void => {
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, scaleTo } = target;
            onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
        });
    };

    return (
        <ul className="rpv-bookmark__list">
            {bookmarks.map((bookmark, index) => {
                return (
                    <li key={index}>
                        <BookmarkItem
                            bookmark={bookmark}
                            depth={depth}
                            doc={doc}
                            store={store}
                            onClick={jumpToDest}
                            onJumpToDest={onJumpToDest}
                        />
                    </li>
                );
            })}
        </ul>
    );
};

export default BookmarkList;
