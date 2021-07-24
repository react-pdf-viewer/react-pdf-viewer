/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs, Store } from '@react-pdf-viewer/core/lib';

import BookmarkList from './BookmarkList';
import DownArrowIcon from './DownArrowIcon';
import RightArrowIcon from './RightArrowIcon';
import StoreProps from './StoreProps';

interface BookmarkItemProps {
    bookmark: PdfJs.Outline;
    depth: number;
    doc: PdfJs.PdfDocument;
    index: number;
    numberOfSiblings: number;
    store: Store<StoreProps>;
    onJumpToDest(dest: PdfJs.OutlineDestinationType): void;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({
    bookmark,
    depth,
    doc,
    index,
    numberOfSiblings,
    store,
    onJumpToDest,
}) => {
    const [expanded, setExpanded] = React.useState(true);

    const hasSubItems = bookmark.items && bookmark.items.length > 0;

    const toggleSubItems = (): void => setExpanded((expanded) => !expanded);

    const clickBookmak = (): void => {
        if (hasSubItems && bookmark.dest) {
            onJumpToDest(bookmark.dest);
        }
    };
    const clickItem = (): void => {
        if (!hasSubItems && bookmark.dest) {
            onJumpToDest(bookmark.dest);
        }
    };

    return (
        <li
            aria-expanded={expanded ? 'true' : 'false'}
            aria-label={bookmark.title}
            aria-level={depth + 1}
            aria-posinset={index + 1}
            aria-setsize={numberOfSiblings}
            role="treeitem"
            tabIndex={-1}
        >
            <div
                className="rpv-bookmark__item"
                style={{
                    paddingLeft: `${depth * 1.25}rem`,
                }}
                onClick={clickItem}
            >
                {hasSubItems && (
                    <span className="rpv-bookmark__toggle" onClick={toggleSubItems}>
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
            {hasSubItems && expanded && (
                <BookmarkList
                    bookmarks={bookmark.items}
                    depth={depth + 1}
                    doc={doc}
                    isRoot={false}
                    store={store}
                    onJumpToDest={onJumpToDest}
                />
            )}
        </li>
    );
};

export default BookmarkItem;
