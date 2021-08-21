/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { CheckIcon } from '../icons/CheckIcon';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';

export const MenuItem: React.FC<{
    checked?: boolean;
    icon?: React.ReactElement;
    isDisabled?: boolean;
    onClick(): void;
}> = ({ checked = false, children, icon = null, isDisabled = false, onClick }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    return (
        <button
            className={classNames({
                'rpv-core__menu-item': true,
                'rpv-core__menu-item--disabled': isDisabled,
                'rpv-core__menu-item--ltr': !isRtl,
                'rpv-core__menu-item--rtl': isRtl,
            })}
            role="menuitem"
            tabIndex={-1}
            type="button"
            onClick={onClick}
        >
            <div 
                className={classNames({
                    'rpv-core__menu-item-icon': true,
                    'rpv-core__menu-item-icon--ltr': !isRtl,
                    'rpv-core__menu-item-icon--rtl': isRtl,
                })}
            >
                {icon}
            </div>
            <div 
                className={classNames({
                    'rpv-core__menu-item-label': true,
                    'rpv-core__menu-item-label--ltr': !isRtl,
                    'rpv-core__menu-item-label--rtl': isRtl,
                })}
            >
                {children}
            </div>
            <div
                className={classNames({
                    'rpv-core__menu-item-check': true,
                    'rpv-core__menu-item-check--ltr': !isRtl,
                    'rpv-core__menu-item-check--rtl': isRtl,
                })}            
            >
                {checked && <CheckIcon />}
            </div>
        </button>
    );
};
