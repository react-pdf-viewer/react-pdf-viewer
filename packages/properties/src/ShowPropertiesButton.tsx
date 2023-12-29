/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, MinimalButton, Position, Tooltip, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { InfoIcon } from './InfoIcon';
import { type RenderShowPropertiesProps } from './types/RenderShowPropertiesProps';

export const ShowPropertiesButton: React.FC<RenderShowPropertiesProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label =
        l10n && l10n.properties ? ((l10n.properties as LocalizationMap).showProperties as string) : 'Show properties';

    return (
        <Tooltip
            ariaControlsSuffix="properties"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label} testId="properties__button" onClick={onClick}>
                    <InfoIcon />
                </MinimalButton>
            }
            content={() => label}
        />
    );
};
