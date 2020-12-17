/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderGoToNextPageProps } from './GoToNextPage';
import NextIcon from './NextIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const GoToNextPageButton: React.FC<RenderGoToNextPageProps> = ({ onClick }) => {
    const l10n = React.useContext(LocalizationContext);
    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.goToNextPage : 'Next page';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={onClick}><NextIcon /></Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default GoToNextPageButton;
