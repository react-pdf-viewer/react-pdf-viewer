/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContext from '../theme/ThemeContext';
import getDestination from '../utils/getDestination';
import PdfJs from '../vendors/PdfJs';
import BookmarkItem from './BookmarkItem';
import './bookmarkList.less';

interface BookmarkListProps {
    bookmarks: PdfJs.Outline[];
    depth: number;
    doc: PdfJs.PdfDocument;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, depth = 0, doc, onJumpToDest }) => {
    const theme = useContext(ThemeContext);
    const jumpToDest = (dest: PdfJs.OutlineDestinationType): void => {
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, scaleTo } = target;
            onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
        });
    };

    return (
        <ul className={`${theme.prefixClass}-bookmark-list`}>
        {
            bookmarks.map((bookmark, index) => {
                return (
                    <li key={index}>
                        <BookmarkItem
                            bookmark={bookmark}
                            depth={depth}
                            doc={doc}
                            onClick={jumpToDest}
                            onJumpToDest={onJumpToDest}
                        />
                    </li>
                );
            })
        }
        </ul>
    );
};

export default BookmarkList;
