/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { classNames, TextDirection, ThemeContext } from '@react-pdf-viewer/core';
import * as React from 'react';
import styles from './styles/propertyItem.module.css';

export const PropertyItem: React.FC<{
    label: string;
    value: string;
}> = ({ label, value }) => {
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    return (
        <dl
            className={classNames({
                [styles.item]: true,
                [styles.itemRtl]: isRtl,
            })}
        >
            <dt className={styles.label}>{label}:</dt>
            <dd className={styles.value}>{value || '-'}</dd>
        </dl>
    );
};
