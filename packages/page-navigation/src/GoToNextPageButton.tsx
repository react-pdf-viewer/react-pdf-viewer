/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext, MinimalButton, Position, Tooltip } from '@react-pdf-viewer/core';

import { NextIcon } from './NextIcon';
import type { RenderGoToPageProps } from './types/index';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const GoToNextPageButton: React.FC<RenderGoToPageProps> = ({ isDisabled, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = l10n && l10n.pageNavigation ? l10n.pageNavigation.goToNextPage : 'Next page';

    return (
        <Tooltip
            ariaControlsSuffix="page-navigation-next"
            position={Position.BottomCenter}
            target={
                <MinimalButton ariaLabel={label as string} isDisabled={isDisabled} onClick={onClick}>
                    <NextIcon />
                </MinimalButton>
            }
            content={() => label}
            offset={TOOLTIP_OFFSET}
        />
    );
};
