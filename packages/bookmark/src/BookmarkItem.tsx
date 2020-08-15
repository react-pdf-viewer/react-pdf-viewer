/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { createRef, useRef } from 'react';
import { PdfJs, SpecialZoomLevel } from '@react-pdf-viewer/core';

import './bookmarkItem.less';
import BookmarkList from './BookmarkList';

interface BookmarkItemProps {
    bookmark: PdfJs.Outline;
    depth: number;
    doc: PdfJs.PdfDocument;
    onClick(dest: PdfJs.OutlineDestinationType): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, depth, doc, onClick, onJumpToDest }) => {
    const toggleRef = createRef<HTMLSpanElement>();
    const subItemRef = createRef<HTMLDivElement>();
    const subItemsDisplayed = useRef(true);

    const hasSubItems = bookmark.items && bookmark.items.length > 0;

    const toggleSubItems = (): void => {
        subItemsDisplayed.current = !subItemsDisplayed.current;
        const subItemsEle = subItemRef.current;
        const toggleEle = toggleRef.current;
        if (!subItemsEle || !toggleEle) {
            return;
        }
        subItemsEle.style.display = subItemsDisplayed.current ? 'block' : 'none';
        toggleEle.classList.toggle('rpv-bookmark-toggle-expanded');
    };

    const clickBookmak = (): void => {
        if (hasSubItems && bookmark.dest) {
            onClick(bookmark.dest);
        }
    };
    const clickItem = (): void => {
        if (!hasSubItems && bookmark.dest) {
            onClick(bookmark.dest);
        }
    };

    return (
        <>
            <div
                className='rpv-bookmark-item'
                style={{
                    paddingLeft: `${depth * 20 + 4}px`,
                }}
                onClick={clickItem}
            >
                {
                    hasSubItems && (
                        <span
                            ref={toggleRef}
                            className='rpv-bookmark-toggle'
                            onClick={toggleSubItems}
                        >
                            ►
                        </span>
                    )
                }
                {
                    bookmark.url
                    ? (
                        <a
                            className='rpv-bookmark-title'
                            href={bookmark.url}
                            rel='noopener noreferrer nofollow'
                            target={bookmark.newWindow ? '_blank' : ''}
                        >
                            {bookmark.title}
                        </a>
                    )
                    : (
                        <div
                            className='rpv-bookmark-title'
                            onClick={clickBookmak}
                        >
                            {bookmark.title}
                        </div>
                    )
                }
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
