/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import ThemeContent from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import { SpecialLevel } from '../zoom/zoomingLevel';
import './bookmarkItem.less';
import BookmarkList from './BookmarkList';

interface BookmarkItemProps {
    bookmark: PdfJs.Outline;
    depth: number;
    doc: PdfJs.PdfDocument;
    onClick(dest: PdfJs.OutlineDestinationType): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialLevel): void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, depth, doc, onClick, onJumpToDest }) => {
    const theme = React.useContext(ThemeContent);
    const toggleRef = React.createRef<HTMLSpanElement>();
    const subItemRef = React.createRef<HTMLDivElement>();
    const subItemsDisplayed = React.useRef(true);

    const hasSubItems = bookmark.items && bookmark.items.length > 0;

    const toggleSubItems = () => {
        subItemsDisplayed.current = !subItemsDisplayed.current;
        const subItemsEle = subItemRef.current;
        const toggleEle = toggleRef.current;
        if (!subItemsEle || !toggleEle) {
            return;
        }
        subItemsEle.style.display = subItemsDisplayed.current ? 'block' : 'none';
        toggleEle.classList.toggle(`${theme.prefixClass}-bookmark-toggle-expanded`);
    };

    const clickBookmak = () => {
        if (hasSubItems) {
            onClick(bookmark.dest);
        }
    };
    const clickItem = () => {
        if (!hasSubItems) {
            onClick(bookmark.dest);
        }
    };

    return (
        <>
            <div
                className={`${theme.prefixClass}-bookmark-item`}
                style={{
                    paddingLeft: `${depth * 20 + 4}px`,
                }}
                onClick={clickItem}
            >
                {
                    hasSubItems && (
                        <span
                            ref={toggleRef}
                            className={`${theme.prefixClass}-bookmark-toggle`}
                            onClick={toggleSubItems}
                        >
                            ►
                        </span>
                    )
                }
                <div
                    className={`${theme.prefixClass}-bookmark-title`}
                    onClick={clickBookmak}
                >
                    {bookmark.title}
                </div>
            </div>
            {
                hasSubItems && (
                    <div ref={subItemRef}>
                        <BookmarkList
                            bookmarks={bookmark.items}
                            depth={depth + 1}
                            doc={doc}
                            onJumpToDest={onJumpToDest}
                        />
                    </div>
                )
            }
        </>
    );
};

export default BookmarkItem;
