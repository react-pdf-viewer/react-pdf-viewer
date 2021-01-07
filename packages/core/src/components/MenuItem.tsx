/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import CheckIcon from '../icons/CheckIcon';
import ThemeContext from '../theme/ThemeContext';

interface MenuItemProps {
    checked?: boolean;
    icon?: React.ReactElement;
    onClick(): void;
}

const MenuItem: React.FC<MenuItemProps> = ({ checked = false, children, icon = null, onClick }) => {
    const theme = React.useContext(ThemeContext);

    return (
        <li className={`${theme.prefixClass}-menu-item`} onClick={onClick}>
            <div className={`${theme.prefixClass}-menu-item-icon`}>
                {icon}
            </div>
            <div className={`${theme.prefixClass}-menu-item-label`}>
                {children}
            </div>
            <div className={`${theme.prefixClass}-menu-item-check`}>
                {checked && <CheckIcon />}
            </div>
        </li>
    );
};

export default MenuItem;
