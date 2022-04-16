/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { getDestination, SpecialZoomLevel } from '@react-pdf-viewer/core';
import type { PdfJs, Store } from '@react-pdf-viewer/core';

import { BookmarkList } from './BookmarkList';
import type { IsBookmarkExpanded } from './types/IsBookmarkExpanded';
import type { StoreProps } from './types/StoreProps';

enum Toggle {
    Collapse,
    Expand,
}

export const BookmarkListRoot: React.FC<{
    bookmarks: PdfJs.Outline[];
    doc: PdfJs.PdfDocument;
    isBookmarkExpanded?: IsBookmarkExpanded;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, leftOffset: number, scaleTo: number | SpecialZoomLevel): void;
}> = ({ bookmarks, doc, isBookmarkExpanded, store, onJumpToDest }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const [links, setLinks] = React.useState(store.get('linkAnnotations') || {});

    const updateLinkAnnotation = (bookmark: PdfJs.Outline, links: Record<string, HTMLElement>): void => {
        const dest = bookmark.dest;
        if (!dest || typeof dest !== 'string' || !links[dest]) {
            return;
        }
        const annotationContainer = links[dest];
        annotationContainer.querySelectorAll(`a[data-annotation-link-dest="${dest}"]`).forEach((node) => {
            node.setAttribute('aria-label', bookmark.title);
        });

        // Loop over the child bookmarks
        if (!bookmark.items || !bookmark.items.length) {
            return;
        }
        bookmark.items.forEach((item) => updateLinkAnnotation(item, links));
    };

    const handleLinkAnnotationsChanged = (links: Record<string, HTMLElement>) => setLinks(links);

    const jumpToDest = (dest: PdfJs.OutlineDestinationType): void => {
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, leftOffset, scaleTo } = target;
            onJumpToDest(pageIndex, bottomOffset, leftOffset, scaleTo);
        });
    };

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
        const closestItem = document.activeElement.closest('.rpv-bookmark__item');
        const titleEle = closestItem.querySelector('.rpv-bookmark__title');
        if (titleEle) {
            (titleEle as HTMLElement).click();
        }
    };

    const moveToItem = (getItemIndex: (bookmarkElements: Element[], activeElement: Element) => number) => {
        const container = containerRef.current;
        const bookmarkElements: Element[] = [].slice.call(container.getElementsByClassName('rpv-bookmark__item'));
        if (bookmarkElements.length === 0) {
            return;
        }

        const activeEle = document.activeElement;

        const targetIndex = Math.min(
            bookmarkElements.length - 1,
            Math.max(0, getItemIndex(bookmarkElements, activeEle as HTMLElement))
        );
        const targetEle = bookmarkElements[targetIndex];

        activeEle.setAttribute('tabindex', '-1');
        targetEle.setAttribute('tabindex', '0');
        (targetEle as HTMLElement).focus();
    };

    const toggle = (toggle: Toggle) => {
        const container = containerRef.current;
        const bookmarkElements: Element[] = [].slice.call(container.getElementsByClassName('rpv-bookmark__item'));
        if (bookmarkElements.length === 0) {
            return;
        }

        const closestItem = document.activeElement.closest('.rpv-bookmark__item');
        const expanedAttribute = toggle === Toggle.Collapse ? 'true' : 'false';
        if (closestItem && closestItem.parentElement.getAttribute('aria-expanded') === expanedAttribute) {
            // Toggle the current node
            const toggleEle = closestItem.querySelector('.rpv-bookmark__toggle');
            if (toggleEle) {
                (toggleEle as HTMLElement).click();
            }
        }
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        store.subscribe('linkAnnotations', handleLinkAnnotationsChanged);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            store.unsubscribe('linkAnnotations', handleLinkAnnotationsChanged);
        };
    }, []);

    React.useEffect(() => {
        bookmarks.forEach((bookmark) => updateLinkAnnotation(bookmark, links));
    }, [links]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const bookmarkElements: HTMLElement[] = [].slice.call(container.getElementsByClassName('rpv-bookmark__item'));

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
                store={store}
                onJumpToDest={jumpToDest}
            />
        </div>
    );
};
