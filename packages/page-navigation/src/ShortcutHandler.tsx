/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import { isMac } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { JumpFromAnnotation, StoreProps } from './types/StoreProps';
import { useCurrentPage } from './useCurrentPage';

export const ShortcutHandler: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    numPages: number;
    store: Store<StoreProps>;
}> = ({ containerRef, numPages, store }) => {
    const jumpFromAnnotationRef = React.useRef<JumpFromAnnotation>(
        store.get('jumpFromAnnotation') || {
            bottomOffset: 0,
            dest: '',
            leftOffset: 0,
            pageIndex: -1,
        }
    );
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

    const jumpToAnnotation = (target: JumpFromAnnotation) => {
        const jumpToDestination = store.get('jumpToDestination');
        if (jumpToDestination) {
            const { pageIndex, bottomOffset, leftOffset } = target;
            jumpToDestination(pageIndex, bottomOffset, leftOffset);
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

        const isCommandPressed = isMac() ? e.metaKey && !e.ctrlKey : e.ctrlKey;
        const shouldJumpBackAnnotation = isCommandPressed && e.key === 'ArrowUp';
        if (shouldGoToNextPage) {
            e.preventDefault();
            goToNextPage();
        } else if (shouldGoToPreviousPage) {
            e.preventDefault();
            goToPreviousPage();
        } else if (shouldJumpBackAnnotation && jumpFromAnnotationRef.current && jumpFromAnnotationRef.current.dest) {
            e.preventDefault();
            jumpToAnnotation(jumpFromAnnotationRef.current);
        }
    };

    const handleJumpFromAnnotationChanged = (target: JumpFromAnnotation) => {
        jumpFromAnnotationRef.current = target;
    };

    React.useEffect(() => {
        store.subscribe('jumpFromAnnotation', handleJumpFromAnnotationChanged);

        return () => {
            store.unsubscribe('jumpFromAnnotation', handleJumpFromAnnotationChanged);
        };
    }, []);

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
