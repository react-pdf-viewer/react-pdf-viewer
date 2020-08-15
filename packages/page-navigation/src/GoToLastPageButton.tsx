/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import DownArrowIcon from './DownArrowIcon';
import { RenderGoToLastPageProps } from './GoToLastPage';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const GoToLastPageButton: FC<RenderGoToLastPageProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
            ? l10nContext.plugins.pageNavigation.goToLastPageButton
            : 'Last page';

    return (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={onClick}><DownArrowIcon /></Button>}
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};

export default GoToLastPageButton;
