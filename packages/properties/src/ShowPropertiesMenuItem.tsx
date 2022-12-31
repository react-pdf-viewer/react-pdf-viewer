/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext, MenuItem } from '@react-pdf-viewer/core';
import * as React from 'react';
import { InfoIcon } from './InfoIcon';
import type { RenderShowPropertiesProps } from './types/RenderShowPropertiesProps';

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
