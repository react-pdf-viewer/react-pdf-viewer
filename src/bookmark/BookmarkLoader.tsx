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
import { SpecialLevel } from '../zoom/zoomingLevel';
import BookmarkList from './BookmarkList';

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
                <div style={{ width: '100%' }}>
                    {
                        bookmarks.items.length === 0
                            ? <div style={{ textAlign: 'center' }}>{l10n.bookmark.noBookmark}</div>
                            : (
                                <BookmarkList
                                    bookmarks={bookmarks.items}
                                    depth={0}
                                    doc={doc}
                                    onJumpToDest={onJumpToDest}
                                />
                            )
                    }
                </div>
            )
    );
};

export default BookmarkLoader;
