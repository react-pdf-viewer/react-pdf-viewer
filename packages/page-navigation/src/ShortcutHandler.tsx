/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { StoreProps } from './types/StoreProps';
import { useCurrentPage } from './useCurrentPage';

export const ShortcutHandler: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    numPages: number;
    store: Store<StoreProps>;
}> = ({ containerRef, numPages, store }) => {
    const { currentPage } = useCurrentPage(store);
    const currentPageRef = React.useRef(currentPage);
    currentPageRef.current = currentPage;

    // Indicate whether the mouse is inside the viewer container or not
    const isMouseInsideRef = React.useRef(false);

    const handleMouseEnter = () => {
        isMouseInsideRef.current = true;
    };

    const handleMouseLeave = () => {
        isMouseInsideRef.current = false;
    };

    const goToNextPage = () => {
        const jumpToPage = store.get('jumpToPage');
        const targetPage = currentPageRef.current + 1;
        if (jumpToPage && targetPage < numPages) {
            jumpToPage(targetPage);
        }
    };

    const goToPreviousPage = () => {
        const jumpToPage = store.get('jumpToPage');
        const targetPage = currentPageRef.current - 1;
        if (jumpToPage && targetPage >= 0) {
            jumpToPage(targetPage);
        }
    };

    const handleKeydown = (e: KeyboardEvent) => {
        const containerEle = containerRef.current;
        const shouldHandleShortcuts =
            isMouseInsideRef.current || (document.activeElement && containerEle.contains(document.activeElement));

        if (!containerEle || !shouldHandleShortcuts) {
            return;
        }

        const shouldGoToNextPage =
            (e.altKey && e.key === 'ArrowDown') || (!e.shiftKey && !e.altKey && e.key === 'PageDown');
        const shouldGoToPreviousPage =
            (e.altKey && e.key === 'ArrowUp') || (!e.shiftKey && !e.altKey && e.key === 'PageUp');
        if (shouldGoToNextPage) {
            e.preventDefault();
            goToNextPage();
        } else if (shouldGoToPreviousPage) {
            e.preventDefault();
            goToPreviousPage();
        }
    };

    React.useEffect(() => {
        const containerEle = containerRef.current;
        if (!containerEle) {
            return;
        }

        document.addEventListener('keydown', handleKeydown);
        containerEle.addEventListener('mouseenter', handleMouseEnter);
        containerEle.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
            containerEle.removeEventListener('mouseenter', handleMouseEnter);
            containerEle.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [containerRef.current]);

    return <></>;
};
