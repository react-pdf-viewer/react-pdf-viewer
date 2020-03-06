/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import CheckIcon from '../icons/CheckIcon';
import './menuItem.less';

interface MenuItemProps {
    checked?: boolean;
    icon?: React.ReactElement;
    onClick(): void;
}

const MenuItem: React.FC<MenuItemProps> = ({ checked = false, children, icon = null, onClick }) => {
    return (
        <li
            className="viewer-menu-item"
            style={{
                alignItems: 'center',
                display: 'flex',
                padding: '4px 0',
            }}
            onClick={onClick}
        >
            <div
                style={{
                    paddingLeft: '16px',
                    paddingRight: '8px',
                }}
            >
                {icon}
            </div>
            <div
                style={{
                    flexGrow: 1,
                    flexShrink: 1,
                    paddingRight: '32px',
                }}
            >
                {children}
            </div>
            <div style={{ paddingRight: '16px' }}>{checked && <CheckIcon />}</div>
        </li>
    );
};

export default MenuItem;
