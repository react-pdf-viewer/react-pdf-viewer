/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderDownloadProps } from './Download';
import DownloadIcon from './DownloadIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const DownloadButton: React.FC<RenderDownloadProps> = ({ onClick }) => {
    const l10n = useContext(LocalizationContext);

    const label = l10n && l10n.download ? l10n.download.download : 'Download';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={onClick}><DownloadIcon /></Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default DownloadButton;
