/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkList } from './BookmarkList';
import { DownArrowIcon } from './DownArrowIcon';
import { RightArrowIcon } from './RightArrowIcon';
import { shouldBeCollapsed } from './shouldBeCollapsed';
import type { IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import type { RenderBookmarkItem } from './types/RenderBookmarkItemProps';
import type { StoreProps } from './types/StoreProps';

export const BookmarkItem: React.FC<{
    bookmark: PdfJs.Outline;
    depth: number;
    doc: PdfJs.PdfDocument;
    index: number;
    isBookmarkExpanded?: IsBookmarkExpanded;
    numberOfSiblings: number;
    renderBookmarkItem?: RenderBookmarkItem;
    store: Store<StoreProps>;
    onJumpToDest(dest: PdfJs.OutlineDestinationType): void;
}> = ({
    bookmark,
    depth,
    doc,
    index,
    isBookmarkExpanded,
    numberOfSiblings,
    renderBookmarkItem,
    store,
    onJumpToDest,
}) => {
    const defaultIsCollapsed = React.useMemo(() => shouldBeCollapsed(bookmark), [bookmark]);
    const defaultExpanded = isBookmarkExpanded
        ? isBookmarkExpanded({ bookmark, doc, depth, index })
        : !defaultIsCollapsed;
    const [expanded, setExpanded] = React.useState(defaultExpanded);

    const hasSubItems = bookmark.items && bookmark.items.length > 0;

    const toggleSubItems = (): void => setExpanded((expanded) => !expanded);

    const clickBookmark = (): void => {
        if (hasSubItems && bookmark.dest) {
            onJumpToDest(bookmark.dest);
        }
    };
    const clickItem = (): void => {
        if (!hasSubItems && bookmark.dest) {
            onJumpToDest(bookmark.dest);
        }
    };

    const defaultRenderItem = (onClickItem: () => void, children: React.ReactNode) => (
        <div
            className="rpv-bookmark__item"
            style={{
                paddingLeft: `${depth * 1.25}rem`,
            }}
            onClick={onClickItem}
        >
            {children}
        </div>
    );

    const defaultRenderToggle = (expandIcon: React.ReactElement, collapseIcon: React.ReactElement) =>
        hasSubItems ? (
            <span className="rpv-bookmark__toggle" onClick={toggleSubItems}>
                {expanded ? expandIcon : collapseIcon}
            </span>
        ) : (
            <span className="rpv-bookmark__toggle" />
        );

    const defaultRenderTitle = (onClickBookmark: () => void) =>
        bookmark.url ? (
            <a
                className="rpv-bookmark__title"
                href={bookmark.url}
                rel="noopener noreferrer nofollow"
                target={bookmark.newWindow ? '_blank' : ''}
            >
                {bookmark.title}
            </a>
        ) : (
            <div className="rpv-bookmark__title" aria-label={bookmark.title} onClick={onClickBookmark}>
                {bookmark.title}
            </div>
        );

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
            {renderBookmarkItem
                ? renderBookmarkItem({
                      bookmark,
                      depth,
                      hasSubItems,
                      isExpanded: expanded,
                      defaultRenderItem,
                      defaultRenderTitle,
                      defaultRenderToggle,
                      onClickItem: clickItem,
                      onClickTitle: clickBookmark,
                      onToggleSubItems: toggleSubItems,
                  })
                : defaultRenderItem(
                      clickItem,
                      <>
                          {defaultRenderToggle(<DownArrowIcon />, <RightArrowIcon />)}
                          {defaultRenderTitle(clickBookmark)}
                      </>
                  )}
            {hasSubItems && expanded && (
                <BookmarkList
                    bookmarks={bookmark.items}
                    depth={depth + 1}
                    doc={doc}
                    isBookmarkExpanded={isBookmarkExpanded}
                    isRoot={false}
                    renderBookmarkItem={renderBookmarkItem}
                    store={store}
                    onJumpToDest={onJumpToDest}
                />
            )}
        </li>
    );
};
