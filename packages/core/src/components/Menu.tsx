/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const Menu: React.FC<{
    children?: React.ReactNode;
}> = ({ children }) => {
    const containerRef = React.useRef<HTMLDivElement>();
    const visibleMenuItemsRef = React.useRef<HTMLElement[]>([]);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const handleKeyDown = (e: KeyboardEvent) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        switch (e.key) {
            case 'Tab':
                e.preventDefault();
                break;

            case 'ArrowDown':
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                moveToItem((_, currentIndex) => currentIndex + 1);
                break;

            case 'ArrowUp':
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                moveToItem((_, currentIndex) => currentIndex - 1);
                break;

            case 'End':
                e.preventDefault();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                moveToItem((items, _) => items.length - 1);
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

    const moveToItem = (getNextItem: (items: HTMLElement[], currentIndex: number) => number) => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const items = visibleMenuItemsRef.current;

        const currentIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');
        const targetIndex = Math.min(items.length - 1, Math.max(0, getNextItem(items, currentIndex)));

        if (currentIndex >= 0 && currentIndex <= items.length - 1) {
            items[currentIndex].setAttribute('tabindex', '-1');
        }
        items[targetIndex].setAttribute('tabindex', '0');
        (items[targetIndex] as HTMLElement).focus();
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
    }, []);

    useIsomorphicLayoutEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-orientation="vertical"
            className={classNames({
                'rpv-core__menu': true,
                'rpv-core__menu--rtl': isRtl,
            })}
            role="menu"
            tabIndex={0}
        >
            {children}
        </div>
    );
};
