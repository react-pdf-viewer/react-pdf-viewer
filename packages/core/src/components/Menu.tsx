/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

interface MenuProps {
    children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ children }) => {
    const containerRef = React.useRef<HTMLDivElement>();

    const handleKeyDown = (e: KeyboardEvent) => {
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

        const items = Array.from(container.querySelectorAll('.rpv-core__menu-item[role="menuitem"]'));
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

        const items = Array.from(container.querySelectorAll('.rpv-core__menu-item[role="menuitem"]'));
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

    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        // Focus the first menu item automatically
        const firstItem = container.querySelector('.rpv-core__menu-item[role="menuitem"]');
        if (firstItem) {
            (firstItem as HTMLElement).focus();
            firstItem.setAttribute('tabindex', '0');
        }

        container.addEventListener('keydown', handleKeyDown);
        return () => container.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div ref={containerRef} aria-orientation="vertical" className="rpv-core__menu" role="menu" tabIndex={-1}>
            {children}
        </div>
    );
};

export default Menu;
