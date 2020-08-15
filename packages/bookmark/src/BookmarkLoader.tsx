/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useEffect, useState } from 'react';
import { LocalizationContext, PdfJs, SpecialZoomLevel, Spinner } from '@react-pdf-viewer/core';

import BookmarkList from './BookmarkList';
import './bookmarkLoaded.less';

interface BookmarkLoaderProps {
    doc: PdfJs.PdfDocument;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}
interface BookmarkState {
    isLoaded: boolean;
    items: PdfJs.Outline[];
}

const BookmarkLoader: React.FC<BookmarkLoaderProps> = ({ doc, onJumpToDest }) => {
    const l10n = useContext(LocalizationContext);
    const [bookmarks, setBookmarks] = useState<BookmarkState>({
        isLoaded: false,
        items: [],
    });

    useEffect(() => {
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

    return (
        !bookmarks.isLoaded
            ? <Spinner />
            : (
                bookmarks.items.length === 0
                    ? <div className='rpv-bookmark-empty'>
                        {l10n && l10n.plugins && l10n.plugins.bookmark ? l10n.plugins.bookmark.noBookmark : 'There is no bookmark'}
                    </div>
                    : (
                        <BookmarkList
                            bookmarks={bookmarks.items}
                            depth={0}
                            doc={doc}
                            onJumpToDest={onJumpToDest}
                        />
                    )
            )
    );
};

export default BookmarkLoader;
