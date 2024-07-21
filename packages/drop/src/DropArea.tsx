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
    TextDirection,
    ThemeContext,
    type LocalizationMap,
} from '@react-pdf-viewer/core';
import * as React from 'react';
import styles from './styles/dropArea.module.css';
import { useDrop } from './useDrop';

export const DropArea: React.FC<{
    containerRef: React.RefObject<HTMLDivElement>;
    openFile(file: File): void;
}> = ({ containerRef, openFile }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const { isDragging } = useDrop(containerRef, (files) => {
        if (files.length === 0) {
            return;
        }
        openFile(files[0]);
    });
    const { l10n } = React.useContext(LocalizationContext);

    return (
        <>
            {isDragging && (
                <div className={styles.container}>
                    <div
                        className={classNames({
                            [styles.inner]: true,
                            [styles.innerRtl]: isRtl,
                        })}
                    >
                        {l10n && l10n.drop
                            ? ((l10n.drop as LocalizationMap).dragDropFile as string)
                            : 'Drag and drop a PDF document here'}
                    </div>
                </div>
            )}
        </>
    );
};
