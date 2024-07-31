/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type PdfJs, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkItem } from './BookmarkItem';
import styles from './styles/bookmarkList.module.css';
import { type IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import { type RenderBookmarkItem } from './types/RenderBookmarkItemProps';
import { type StoreProps } from './types/StoreProps';

type BookmarkListProps = {
    bookmarks: PdfJs.Outline[];
    depth: number;
    doc: PdfJs.PdfDocument;
    isBookmarkExpanded?: IsBookmarkExpanded;
    isRoot: boolean;
    pathFromRoot: string;
    renderBookmarkItem?: RenderBookmarkItem;
    store: Store<StoreProps>;
};

const BookmarkList = React.forwardRef<HTMLUListElement, BookmarkListProps>(
    ({ bookmarks, depth = 0, doc, isBookmarkExpanded, isRoot, pathFromRoot, renderBookmarkItem, store }, ref) => (
        <ul
            className={styles.list}
            ref={ref}
            role={isRoot ? 'tree' : 'group'}
            style={{
                display: isRoot ? 'block' : 'none',
            }}
            tabIndex={-1}
        >
            {bookmarks.map((bookmark, index) => (
                <BookmarkItem
                    bookmark={bookmark}
                    depth={depth}
                    doc={doc}
                    index={index}
                    isBookmarkExpanded={isBookmarkExpanded}
                    key={index}
                    numberOfSiblings={bookmarks.length}
                    pathFromRoot={pathFromRoot}
                    renderBookmarkItem={renderBookmarkItem}
                    store={store}
                />
            ))}
        </ul>
    ),
);
BookmarkList.displayName = 'BookmarkList';
export { BookmarkList };
