/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { InfoIcon } from './InfoIcon';
import type { RenderShowPropertiesProps } from './types/RenderShowPropertiesProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const ShowPropertiesButton: React.FC<RenderShowPropertiesProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.properties ? l10n.properties.showProperties : 'Show properties';

    return (
        <Tooltip
            ariaControlsSuffix="properties"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label as string} onClick={onClick}>
                    <InfoIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
