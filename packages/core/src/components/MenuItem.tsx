/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import CheckIcon from '../icons/CheckIcon';
import classNames from '../utils/classNames';

interface MenuItemProps {
    checked?: boolean;
    icon?: React.ReactElement;
    isDisabled?: boolean;
    onClick(): void;
}

const MenuItem: React.FC<MenuItemProps> = ({ checked = false, children, icon = null, isDisabled = false, onClick }) => (
    <button
        className={classNames({
            'rpv-core__menu-item': true,
            'rpv-core__menu-item--disabled': isDisabled,
        })}
        onClick={onClick}
    >
        <div className="rpv-core__menu-item-icon">{icon}</div>
        <div className="rpv-core__menu-item-label">{children}</div>
        <div className="rpv-core__menu-item-check">{checked && <CheckIcon />}</div>
    </button>
);

export default MenuItem;
