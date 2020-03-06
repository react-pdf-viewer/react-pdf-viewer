/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import PdfJs from '../PdfJs';
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
        toggleEle.style.transform = subItemsDisplayed.current ? 'rotate(90deg)' : '';
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
                className="viewer-bookmark-item"
                style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: `6px 4px 6px ${depth * 20 + 4}px`,
                }}
                onClick={clickItem}
            >
                {
                    hasSubItems && (
                        <span
                            ref={toggleRef}
                            style={{
                                marginRight: '4px',
                                transform: 'rotate(90deg)',
                            }}
                            onClick={toggleSubItems}
                        >
                            ►
                        </span>
                    )
                }
                <div
                    onClick={clickBookmak}
                    style={{
                        flexGrow: 1,
                        flexShrink: 1,
                    }}
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
