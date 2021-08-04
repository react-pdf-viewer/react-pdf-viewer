/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { DownloadIcon } from './DownloadIcon';
import type { RenderDownloadProps } from './types/RenderDownloadProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const DownloadButton: React.FC<RenderDownloadProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.download ? l10n.download.download : 'Download';

    return (
        <Tooltip
            ariaControlsSuffix="get-file"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label as string} onClick={onClick}>
                    <DownloadIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
