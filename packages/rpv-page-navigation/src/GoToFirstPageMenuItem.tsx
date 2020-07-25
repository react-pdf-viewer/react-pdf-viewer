/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { LocalizationContext, MenuItem } from '@phuocng/rpv';

import { RenderGoToFirstPageProps } from './GoToFirstPage';
import UpArrowIcon from './UpArrowIcon';

const GoToFirstPageMenuItem: FC<RenderGoToFirstPageProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
            ? l10nContext.plugins.pageNavigation.goToFirstPageMenuItem
            : 'Go to first page';

    return (
        <MenuItem icon={<UpArrowIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};

export default GoToFirstPageMenuItem;
