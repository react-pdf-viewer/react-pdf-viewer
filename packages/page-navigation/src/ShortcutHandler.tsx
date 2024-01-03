/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { isMac, type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { type StoreProps } from './types/StoreProps';
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

    const [element, setElement] = React.useState(containerRef.current);

    React.useEffect(() => {
        if (containerRef.current !== element) {
            setElement(containerRef.current);
        }
    }, []);

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

    const jumpToNextDestination = () => {
        const jumpToNextDestination = store.get('jumpToNextDestination');
        if (jumpToNextDestination) {
            jumpToNextDestination();
        }
    };

    const jumpToPreviousDestination = () => {
        const jumpToPreviousDestination = store.get('jumpToPreviousDestination');
        if (jumpToPreviousDestination) {
            jumpToPreviousDestination();
        }
    };

    const handleDocumentKeyDown = React.useCallback(
        (e: KeyboardEvent) => {
            if (!element) {
                return;
            }
            const shouldHandleShortcuts =
                isMouseInsideRef.current || (document.activeElement && element.contains(document.activeElement));
            if (!shouldHandleShortcuts) {
                return;
            }

            const shouldGoToNextPage =
                (e.altKey && e.key === 'ArrowDown') || (!e.shiftKey && !e.altKey && e.key === 'PageDown');
            const shouldGoToPreviousPage =
                (e.altKey && e.key === 'ArrowUp') || (!e.shiftKey && !e.altKey && e.key === 'PageUp');

            if (shouldGoToNextPage) {
                e.preventDefault();
                goToNextPage();
                return;
            }
            if (shouldGoToPreviousPage) {
                e.preventDefault();
                goToPreviousPage();
                return;
            }

            const isCommandPressed = isMac() ? e.metaKey && !e.ctrlKey : e.altKey;
            if (isCommandPressed) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        jumpToPreviousDestination();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        jumpToNextDestination();
                        break;
                    default:
                        break;
                }
            }
        },
        [element],
    );

    React.useEffect(() => {
        if (!element) {
            return;
        }

        document.addEventListener('keydown', handleDocumentKeyDown);
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [element]);

    return <></>;
};
