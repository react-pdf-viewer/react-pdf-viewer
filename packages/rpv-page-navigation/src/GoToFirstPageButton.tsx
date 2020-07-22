/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';
import { Button, LocalizationContext, Position, Tooltip } from '@phuocng/rpv';

import { RenderGoToFirstPageProps } from './GoToFirstPage';
import UpArrowIcon from './UpArrowIcon';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const GoToFirstPageButton: React.FC<RenderGoToFirstPageProps> = ({ onClick }) => {
    const l10nContext = useContext(LocalizationContext);

    const label = (l10nContext && l10nContext.plugins && l10nContext.plugins.pageNavigation)
            ? l10nContext.plugins.pageNavigation.goToFirstPageButton
            : 'First page';

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
