/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@phuocng/rpv';

import { RenderPrintProps } from './Print';
import PrintIcon from './PrintIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const PrintButton: React.FC<RenderPrintProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.print)
            ? l10nContext.plugins.print.print
            : 'Print';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={onClick}><PrintIcon /></Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default PrintButton;
