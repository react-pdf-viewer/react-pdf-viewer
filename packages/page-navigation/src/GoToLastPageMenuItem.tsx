/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import DownArrowIcon from './DownArrowIcon';

export interface GoToLastPageMenuItemProps {
    onClick(): void;
}

const GoToLastPageMenuItem: React.FC<GoToLastPageMenuItemProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.goToLastPage : 'Last page';

    return (
        <MenuItem icon={<DownArrowIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};

export default GoToLastPageMenuItem;
