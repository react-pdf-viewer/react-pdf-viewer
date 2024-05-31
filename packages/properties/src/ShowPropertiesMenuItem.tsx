/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, MenuItem, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { InfoIcon } from './InfoIcon';
import { type RenderShowPropertiesProps } from './types/RenderShowPropertiesProps';

export const ShowPropertiesMenuItem: React.FC<RenderShowPropertiesProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label =
        l10n && l10n.properties ? ((l10n.properties as LocalizationMap).showProperties as string) : 'Show properties';

    return (
        <MenuItem icon={<InfoIcon />} testId="properties__menu" onClick={onClick}>
            {label}
        </MenuItem>
    );
};
