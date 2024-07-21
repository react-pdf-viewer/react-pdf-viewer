/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    classNames,
    LocalizationContext,
    MinimalButton,
    TextDirection,
    ThemeContext,
    type LocalizationMap,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import { ExitFullScreenIcon } from './ExitFullScreenIcon';
import styles from './styles/exitFullScreenButton.module.css';

export const ExitFullScreenButton: React.FC<{
    onClick(): void;
}> = ({ onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const exitFullScreenLabel =
        l10n && l10n.fullScreen ? ((l10n.fullScreen as LocalizationMap).exitFullScreen as string) : 'Exit full screen';

    return (
        <div
            className={classNames({
                [styles.button]: true,
                [styles.buttonLtr]: !isRtl,
                [styles.buttonRtl]: isRtl,
            })}
        >
            <MinimalButton
                ariaLabel={exitFullScreenLabel as string}
                testId="full-screen__exit-button"
                onClick={onClick}
            >
                <ExitFullScreenIcon />
            </MinimalButton>
        </div>
    );
};
