/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@react-pdf-viewer/core';

import { RenderGoToNextPageProps } from './GoToNextPage';
import NextIcon from './NextIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const GoToNextPageButton: FC<RenderGoToNextPageProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);
        
    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
        ? l10nContext.plugins.pageNavigation.nextPage
        : 'Next page';

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
