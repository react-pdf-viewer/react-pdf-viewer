/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type PdfJs, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { BookmarkList } from './BookmarkList';
import styles from './styles/bookmarkItem.module.css';
import { type IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import { type RenderBookmarkItem } from './types/RenderBookmarkItemProps';
import { type StoreProps } from './types/StoreProps';

enum Toggle {
    Collapse,
    Expand,
}

export const BookmarkListRoot: React.FC<{
    bookmarks: PdfJs.Outline[];
    doc: PdfJs.PdfDocument;
    isBookmarkExpanded?: IsBookmarkExpanded;
    renderBookmarkItem?: RenderBookmarkItem;
    store: Store<StoreProps>;
}> = ({ bookmarks, doc, isBookmarkExpanded, renderBookmarkItem, store }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        const container = containerRef.current;
        if (!container || !(e.target instanceof HTMLElement) || !container.contains(e.target)) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                moveToItem((bookmarkElements, activeEle) => bookmarkElements.indexOf(activeEle) + 1);
                break;

            case 'ArrowLeft':
                e.preventDefault();
                toggle(Toggle.Collapse);
                break;

            case 'ArrowRight':
                e.preventDefault();
                toggle(Toggle.Expand);
                break;

            case 'ArrowUp':
                e.preventDefault;
                moveToItem((bookmarkElements, activeEle) => bookmarkElements.indexOf(activeEle) - 1);
                break;

            case 'End':
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                moveToItem((bookmarkElements, _) => bookmarkElements.length - 1);
                break;

            case ' ':
            case 'Enter':
            case 'Space':
                e.preventDefault();
                clickBookmark();
                break;

            case 'Home':
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                moveToItem((_, __) => 0);
                break;

            default:
                break;
        }
    };

    const clickBookmark = () => {
        const closestItem = document.activeElement?.closest(`.${styles.item}`);
        const titleEle = closestItem?.querySelector(`.${styles.title}`);
        if (titleEle) {
            (titleEle as HTMLElement).click();
        }
    };

    const moveToItem = (getItemIndex: (bookmarkElements: Element[], activeElement: Element) => number) => {
        const container = containerRef.current;
        const bookmarkElements: Element[] = [].slice.call(container?.getElementsByClassName(styles.item));
        if (bookmarkElements.length === 0) {
            return;
        }

        const activeEle = document.activeElement!;

        const targetIndex = Math.min(
            bookmarkElements.length - 1,
            Math.max(0, getItemIndex(bookmarkElements, activeEle as HTMLElement)),
        );
        const targetEle = bookmarkElements[targetIndex];

        activeEle.setAttribute('tabindex', '-1');
        targetEle.setAttribute('tabindex', '0');
        (targetEle as HTMLElement).focus();
    };

    const toggle = (toggle: Toggle) => {
        const container = containerRef.current;
        const bookmarkElements: Element[] = [].slice.call(container?.getElementsByClassName(styles.item));
        if (bookmarkElements.length === 0) {
            return;
        }

        const closestItem = document.activeElement?.closest(`.${styles.item}`);
        const expanedAttribute = toggle === Toggle.Collapse ? 'true' : 'false';
        if (closestItem && closestItem.parentElement?.getAttribute('aria-expanded') === expanedAttribute) {
            // Toggle the current node
            const toggleEle = closestItem.querySelector(`.${styles.toggle}`);
            if (toggleEle) {
                (toggleEle as HTMLElement).click();
            }
        }
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const bookmarkElements: HTMLElement[] = [].slice.call(container.getElementsByClassName(styles.item));

        // Focus on the first bookmark item
        if (bookmarkElements.length > 0) {
            bookmarkElements[0].focus();
            bookmarkElements[0].setAttribute('tabindex', '0');
        }
    }, []);

    return (
        <div ref={containerRef}>
            <BookmarkList
                bookmarks={bookmarks}
                depth={0}
                doc={doc}
                isBookmarkExpanded={isBookmarkExpanded}
                isRoot={true}
                pathFromRoot=""
                renderBookmarkItem={renderBookmarkItem}
                store={store}
            />
        </div>
    );
};
