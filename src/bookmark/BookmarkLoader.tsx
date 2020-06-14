/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useEffect, useState } from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import SpecialZoomLevel from '../SpecialZoomLevel';
import PdfJs from '../vendors/PdfJs';
import Spinner from '../components/Spinner';
import ThemeContext from '../theme/ThemeContext';
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
    const theme = useContext(ThemeContext);
    const [bookmarks, setBookmarks] = useState<BookmarkState>({
        isLoaded: false,
        items: [],
    });

    useEffect(() => {
        doc.getOutline().then((outline) => {
            setBookmarks({
                isLoaded: true,
                items: outline || [],
            });
        });
    }, []);

    return (
        !bookmarks.isLoaded
            ? <Spinner />
            : (
                bookmarks.items.length === 0
                    ? <div className={`${theme.prefixClass}-bookmark-empty`}>{l10n.bookmark.noBookmark}</div>
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
