/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderGoToFirstPageProps } from './GoToFirstPage';
import UpArrowIcon from './UpArrowIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const GoToFirstPageButton: FC<RenderGoToFirstPageProps> = ({ onClick }) => {
    const l10n = useContext(LocalizationContext);

    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.goToFirstPage : 'First page';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={onClick}><UpArrowIcon /></Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default GoToFirstPageButton;
