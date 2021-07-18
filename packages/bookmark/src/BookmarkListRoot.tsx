/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { getDestination, PdfJs, SpecialZoomLevel, Store } from '@react-pdf-viewer/core';

import BookmarkList from './BookmarkList';
import StoreProps from './StoreProps';

interface BookmarkListRootProps {
    bookmarks: PdfJs.Outline[];
    doc: PdfJs.PdfDocument;
    store: Store<StoreProps>;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const BookmarkListRoot: React.FC<BookmarkListRootProps> = ({ bookmarks, doc, store, onJumpToDest }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const bookmarkElementsRef = React.useRef<HTMLLIElement[]>([]);
    const [currentFocused, setCurrentFocused] = React.useState(0);

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

    const handleLinkAnnotationsChanged = (links: Record<string, HTMLElement>): void => {
        bookmarks.forEach((bookmark) => updateLinkAnnotation(bookmark, links));
    };

    const jumpToDest = (dest: PdfJs.OutlineDestinationType): void => {
        getDestination(doc, dest).then((target) => {
            const { pageIndex, bottomOffset, scaleTo } = target;
            onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                activateNextItem();
                break;

            case 'ArrowUp':
                activatePreviousItem();
                break;

            default:
                break;
        }
    };

    const activateNextItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = bookmarkElementsRef.current;
        const nextItem = currentFocused + 1;

        if (nextItem < items.length) {
            if (currentFocused >= 0) {
                items[currentFocused].setAttribute('tabindex', '-1');
            }
            setCurrentFocused(nextItem);
        }
    };

    const activatePreviousItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = bookmarkElementsRef.current;
        const prevItem = currentFocused - 1;

        if (prevItem >= 0) {
            if (currentFocused >= 0) {
                items[currentFocused].setAttribute('tabindex', '-1');
            }
            setCurrentFocused(prevItem);
        }
    };

    React.useEffect(() => {
        store.subscribe('linkAnnotations', handleLinkAnnotationsChanged);

        return () => {
            store.unsubscribe('linkAnnotations', handleLinkAnnotationsChanged);
        };
    }, []);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const bookmarkElements: HTMLLIElement[] = [].slice.call(container.querySelectorAll('li[role="treeitem"]'));

        // Cache all bookmark elements
        bookmarkElementsRef.current = bookmarkElements;

        // Focus on the first bookmark item
        if (bookmarkElements.length > 0) {
            bookmarkElements[0].focus();
            bookmarkElements[0].setAttribute('tabindex', '0');
        }
    }, []);

    React.useEffect(() => {
        const bookmarkElements = bookmarkElementsRef.current;
        if (bookmarkElements.length === 0 || currentFocused < 0 || currentFocused > bookmarkElements.length) {
            return;
        }

        const bookmarkEle = bookmarkElements[currentFocused];
        bookmarkEle.setAttribute('tabindex', '0');
        bookmarkEle.focus();
    }, [currentFocused]);

    return (
        <div ref={containerRef} onKeyDown={handleKeyDown}>
            <BookmarkList
                bookmarks={bookmarks}
                depth={0}
                doc={doc}
                isRoot={true}
                store={store}
                onJumpToDest={jumpToDest}
            />
        </div>
    );
};

export default BookmarkListRoot;
