/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, MinimalButton, Position, Tooltip, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { UpArrowIcon } from './UpArrowIcon';
import { type RenderGoToPageProps } from './types/index';

export const GoToFirstPageButton: React.FC<RenderGoToPageProps> = ({ isDisabled, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label =
        l10n && l10n.pageNavigation ? ((l10n.pageNavigation as LocalizationMap).goToFirstPage as string) : 'First page';

    return (
        <Tooltip
            ariaControlsSuffix="page-navigation-first"
            position={Position.BottomCenter}
            target={
                <MinimalButton
                    ariaLabel={label}
                    isDisabled={isDisabled}
                    testId="page-navigation__first-button"
                    onClick={onClick}
                >
                    <UpArrowIcon />
                </MinimalButton>
            }
            content={() => label}
        />
    );
};
