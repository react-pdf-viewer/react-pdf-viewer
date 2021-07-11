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
        console.log(e.key);
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
