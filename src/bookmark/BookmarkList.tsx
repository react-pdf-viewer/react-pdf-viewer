/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../PdfJs';
import getDestination from '../utils/getDestination';
import { SpecialLevel } from '../zoom/zoomingLevel';
import BookmarkItem from './BookmarkItem';

interface BookmarkListProps {
    bookmarks: PdfJs.Outline[];
    depth: number;
    doc: PdfJs.PdfDocument;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialLevel): void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, depth = 0, doc, onJumpToDest }) => {
    const jumpToDest = (dest: PdfJs.OutlineDestinationType) => {
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, scaleTo } = target;
            onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
        });
    };

    return (
        <ul
            style={{
                listStyleType: 'none',
                margin: '0',
                padding: '0',
            }}
        >
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
