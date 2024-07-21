/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import {
    Button,
    classNames,
    LocalizationContext,
    ProgressBar,
    TextDirection,
    ThemeContext,
    type LocalizationMap,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import styles from './styles/printProgress.module.css';

export const PrintProgress: React.FC<{
    numLoadedPages: number;
    numPages: number;
    onCancel(): void;
}> = ({ numLoadedPages, numPages, onCancel }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const progress = Math.floor((numLoadedPages * 100) / numPages);

    return (
        <div className={styles.container}>
            <div
                className={classNames({
                    [styles.inner]: true,
                    [styles.innerRtl]: isRtl,
                })}
            >
                <div className={styles.message}>
                    {l10n && l10n.print
                        ? ((l10n.print as LocalizationMap).preparingDocument as string)
                        : 'Preparing document ...'}
                </div>
                <div className={styles.progress}>
                    <ProgressBar progress={progress} />
                </div>
                <Button onClick={onCancel}>
                    {l10n && l10n.print ? ((l10n.print as LocalizationMap).cancel as string) : 'Cancel'}
                </Button>
            </div>
        </div>
    );
};
