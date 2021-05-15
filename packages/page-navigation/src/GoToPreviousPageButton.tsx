/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderGoToPreviousPageProps } from './GoToPreviousPage';
import PreviousIcon from './PreviousIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const GoToPreviousPageButton: React.FC<RenderGoToPreviousPageProps> = ({ isDisabled, onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.goToPreviousPage : 'Previous page';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button isDisabled={isDisabled} onClick={onClick}><PreviousIcon /></Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default GoToPreviousPageButton;
