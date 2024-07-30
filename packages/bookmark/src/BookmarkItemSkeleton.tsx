/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { Skeleton, randomNumber } from '@react-pdf-viewer/core';
import * as React from 'react';
import styles from './styles/bookmarkSkeleton.module.css';

export const BookmarkItemSkeleton: React.FC<{
    depth?: number;
    icon?: React.ReactElement;
}> = ({ depth = 0, icon }) => {
    const width = React.useMemo(() => 10 * randomNumber(4, 8), []);
    return (
        <div className={styles.item} style={{ paddingLeft: `${depth * 1.25}rem` }}>
            <span className={styles.toggle}>{icon ? icon : <></>}</span>
            <div className={styles.title}>
                <Skeleton>
                    {({ attributes, ref }) => (
                        <div
                            ref={ref}
                            {...attributes}
                            style={{
                                borderRadius: 'calc(var(--rpv-radius) - 4px)',
                                height: '1rem',
                                width: `${width}%`,
                            }}
                        />
                    )}
                </Skeleton>
            </div>
        </div>
    );
};
