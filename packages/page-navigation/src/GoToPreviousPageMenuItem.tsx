/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { RenderGoToPreviousPageProps } from './GoToPreviousPage';
import PreviousIcon from './PreviousIcon';

const GoToPrevPageMenuItem: React.FC<RenderGoToPreviousPageProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.goToPreviousPage : 'Previous page';

    return (
        <MenuItem icon={<PreviousIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};

export default GoToPrevPageMenuItem;
