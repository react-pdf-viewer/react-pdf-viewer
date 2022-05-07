/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkItem } from './BookmarkItem';
import type { IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import type { StoreProps } from './types/StoreProps';

export const BookmarkList: React.FC<{
    bookmarks: PdfJs.Outline[];
    depth: number;
    doc: PdfJs.PdfDocument;
    isBookmarkExpanded?: IsBookmarkExpanded;
    isRoot: boolean;
    store: Store<StoreProps>;
    onJumpToDest(dest: PdfJs.OutlineDestinationType): void;
}> = ({ bookmarks, depth = 0, doc, isBookmarkExpanded, isRoot, store, onJumpToDest }) => (
    <ul className="rpv-bookmark__list" role={isRoot ? 'tree' : 'group'} tabIndex={-1}>
        {bookmarks.map((bookmark, index) => (
            <BookmarkItem
                bookmark={bookmark}
                depth={depth}
                doc={doc}
                index={index}
                isBookmarkExpanded={isBookmarkExpanded}
                key={index}
                numberOfSiblings={bookmarks.length}
                store={store}
                onJumpToDest={onJumpToDest}
            />
        ))}
    </ul>
);
