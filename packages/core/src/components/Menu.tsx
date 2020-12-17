/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import ThemeContext from '../theme/ThemeContext';

interface MenuProps {
    children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ children }) => {
    const theme = React.useContext(ThemeContext);

    return (
        <ul className={`${theme.prefixClass}-menu`}>
            {children}
        </ul>
    );
};

export default Menu;
