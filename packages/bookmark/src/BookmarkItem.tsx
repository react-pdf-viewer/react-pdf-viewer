/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, SpecialZoomLevel, Store } from '@react-pdf-viewer/core';

import BookmarkList from './BookmarkList';
import DownArrowIcon from './DownArrowIcon';
import StoreProps from './StoreProps';
import RightArrowIcon from './RightArrowIcon';

interface BookmarkItemProps {
    bookmark: PdfJs.Outline;
    depth: number;
    doc: PdfJs.PdfDocument;
    store: Store<StoreProps>;
    onClick(dest: PdfJs.OutlineDestinationType): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, depth, doc, store, onClick, onJumpToDest }) => {
    const [expanded, setExpanded] = React.useState(true);
    
    const hasSubItems = bookmark.items && bookmark.items.length > 0;

    const toggleSubItems = (): void => setExpanded(expanded => !expanded);

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
        <li aria-expanded={expanded ? 'true' : 'false'} aria-label={bookmark.title} role="treeitem" tabIndex={-1}>
            <div
                className="rpv-bookmark__item"
                style={{
                    paddingLeft: `${depth * 1.25}rem`,
                }}
                onClick={clickItem}
            >
                {hasSubItems && (
                    <span
                        className='rpv-bookmark__toggle'
                        onClick={toggleSubItems}
                    >
                        {expanded ? <DownArrowIcon /> : <RightArrowIcon />}
                    </span>
                )}
                {bookmark.url ? (
                    <a
                        className="rpv-bookmark__title"
                        href={bookmark.url}
                        rel="noopener noreferrer nofollow"
                        target={bookmark.newWindow ? '_blank' : ''}
                    >
                        {bookmark.title}
                    </a>
                ) : (
                    <div className="rpv-bookmark__title" onClick={clickBookmak}>
                        {bookmark.title}
                    </div>
                )}
            </div>
            {hasSubItems && (
                <div style={{ display: expanded ? 'block' : 'none' }}>
                    <BookmarkList
                        bookmarks={bookmark.items}
                        depth={depth + 1}
                        doc={doc}
                        isRoot={false}
                        store={store}
                        onJumpToDest={onJumpToDest}
                    />
                </div>
            )}
        </li>
    );
};

export default BookmarkItem;
