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
    isRoot: boolean;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, depth = 0, doc, isRoot, store, onJumpToDest }) => {
    const jumpToDest = (dest: PdfJs.OutlineDestinationType): void => {
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, scaleTo } = target;
            onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
        });
    };

    return (
        <ul className="rpv-bookmark__list" role={isRoot ? 'tree' : 'group'} tabIndex={isRoot ? 0 : -1}>
        {
            bookmarks.map((bookmark, index) => (         
                <BookmarkItem
                    bookmark={bookmark}
                    depth={depth}                        
                    doc={doc}
                    key={index}
                    store={store}
                    onClick={jumpToDest}
                    onJumpToDest={onJumpToDest}
                />
            ))
        }
        </ul>
    );
};

export default BookmarkList;
