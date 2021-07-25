/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

export const Menu: React.FC = ({ children }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const visibleMenuItemsRef = React.useRef<HTMLElement[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                break;

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

    const activatePreviousItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = visibleMenuItemsRef.current;
        const currentIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
        const prevItem = currentIndex - 1;

        if (prevItem >= 0) {
            if (currentIndex >= 0) {
                items[currentIndex].setAttribute('tabindex', '-1');
            }

            items[prevItem].setAttribute('tabindex', '0');
            (items[prevItem] as HTMLElement).focus();
        }
    };

    const activateNextItem = () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = visibleMenuItemsRef.current;
        const currentIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
        const nextItem = currentIndex + 1;

        if (nextItem < items.length) {
            if (currentIndex >= 0) {
                items[currentIndex].setAttribute('tabindex', '-1');
            }

            items[nextItem].setAttribute('tabindex', '0');
            (items[nextItem] as HTMLElement).focus();
        }
    };

    // Query the visible menu items
    const findVisibleItems = (container: HTMLElement): HTMLElement[] => {
        const visibleItems: HTMLElement[] = [];

        container.querySelectorAll('.rpv-core__menu-item[role="menuitem"]').forEach((item) => {
            if (item instanceof HTMLElement) {
                const parent = item.parentElement;
                if (parent === container) {
                    visibleItems.push(item);
                } else {
                    // The menu item can be placed inside a responsive container such as
                    //  <div className="rpv-core__display--block rpv-core__display--hidden-medium">
                    //      <MenuItem />
                    //  </div>
                    if (window.getComputedStyle(parent).display !== 'none') {
                        visibleItems.push(item);
                    }
                }
            }
        });

        return visibleItems;
    };

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        // Query the visible menu items
        const visibleItems = findVisibleItems(container);

        // Cache them
        visibleMenuItemsRef.current = visibleItems;

        // Focus the first menu item automatically
        if (visibleItems.length > 0) {
            const firstItem = visibleItems[0];
            firstItem.focus();
            firstItem.setAttribute('tabindex', '0');
        }
    }, []);

    return (
        <div
            ref={containerRef}
            aria-orientation="vertical"
            className="rpv-core__menu"
            role="menu"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
        >
            {children}
        </div>
    );
};
