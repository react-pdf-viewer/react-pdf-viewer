/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    LocalizationContext,
    TextDirection,
    ThemeContext,
    classNames,
    type LocalizationMap,
    type PdfJs,
    type Store,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkListRoot } from './BookmarkListRoot';
import { BookmarkSkeleton } from './BookmarkSkeleton';
import styles from './styles/bookmarkListLoader.module.css';
import { type IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import { type RenderBookmarkItem } from './types/RenderBookmarkItemProps';
import { type StoreProps } from './types/StoreProps';

interface BookmarkState {
    isLoaded: boolean;
    items: PdfJs.Outline[];
}

export const BookmarkLoader: React.FC<{
    doc?: PdfJs.PdfDocument;
    isBookmarkExpanded?: IsBookmarkExpanded;
    renderBookmarkItem?: RenderBookmarkItem;
    store: Store<StoreProps>;
}> = ({ doc, isBookmarkExpanded, renderBookmarkItem, store }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const [bookmarks, setBookmarks] = React.useState<BookmarkState>({
        isLoaded: false,
        items: [],
    });

    React.useEffect(() => {
        if (!doc) {
            return;
        }
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

    return !doc || !bookmarks.isLoaded ? (
        <BookmarkSkeleton />
    ) : bookmarks.items.length === 0 ? (
        <div
            data-testid="bookmark__empty"
            className={classNames({
                [styles.empty]: true,
                [styles.emptyRtl]: isRtl,
            })}
        >
            {l10n && l10n.bookmark ? ((l10n.bookmark as LocalizationMap).noBookmark as string) : 'There is no bookmark'}
        </div>
    ) : (
        <div
            data-testid="bookmark__container"
            className={classNames({
                [styles.container]: true,
                [styles.containerRtl]: isRtl,
            })}
        >
            <BookmarkListRoot
                bookmarks={bookmarks.items}
                doc={doc}
                isBookmarkExpanded={isBookmarkExpanded}
                renderBookmarkItem={renderBookmarkItem}
                store={store}
            />
        </div>
    );
};
