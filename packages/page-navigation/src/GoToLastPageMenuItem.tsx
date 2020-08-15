/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import DownArrowIcon from './DownArrowIcon';

export interface GoToLastPageMenuItemProps {
    onClick(): void;
}

const GoToLastPageMenuItem: FC<GoToLastPageMenuItemProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
            ? l10nContext.plugins.pageNavigation.goToLastPageMenuItem
            : 'Go to last page';

    return (
        <MenuItem icon={<DownArrowIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};

export default GoToLastPageMenuItem;
