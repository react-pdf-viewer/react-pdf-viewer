/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';
import * as React from 'react';
import { DownloadIcon } from './DownloadIcon';
import type { RenderDownloadProps } from './types/RenderDownloadProps';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const DownloadButton: React.FC<RenderDownloadProps> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.download ? ((l10n.download as LocalizationMap).download as string) : 'Download';

    return (
        <Tooltip
            ariaControlsSuffix="get-file"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label} testId="get-file__download-button" onClick={onClick}>
                    <DownloadIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
