/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';

import { InfoIcon } from './InfoIcon';
import type { RenderShowPropertiesProps } from './types/RenderShowPropertiesProps';

export const ShowPropertiesMenuItem: React.FC<RenderShowPropertiesProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.properties ? l10n.properties.showProperties : 'Show properties';

    return (
        <MenuItem icon={<InfoIcon />} onClick={onClick}>
            {label}
        </MenuItem>
    );
};
