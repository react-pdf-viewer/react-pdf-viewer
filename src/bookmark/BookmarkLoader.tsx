/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';
import PdfJs from '../PdfJs';
import Spinner from '../Spinner';
import ThemeContent from '../theme/ThemeContext';
import { SpecialLevel } from '../zoom/zoomingLevel';
import BookmarkList from './BookmarkList';
import './bookmarkLoaded.less';

interface BookmarkLoaderProps {
    doc: PdfJs.PdfDocument;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialLevel): void;
}
interface BookmarkState {
    isLoaded: boolean;
    items: PdfJs.Outline[];
}

const BookmarkLoader: React.FC<BookmarkLoaderProps> = ({ doc, onJumpToDest }) => {
    const l10n = React.useContext(LocalizationContext);
    const theme = React.useContext(ThemeContent);
    const [bookmarks, setBookmarks] = React.useState<BookmarkState>({
        isLoaded: false,
        items: [],
    });

    React.useEffect(() => {
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
