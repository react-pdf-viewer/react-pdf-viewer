/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/spinner.module.css';
import { type VisibilityChanged } from '../types/VisibilityChanged';
import { classNames } from '../utils/classNames';

export const Spinner: React.FC<{
    size?: string;
    testId?: string;
}> = ({ size = '4rem', testId }) => {
    const [visible, setVisible] = React.useState(false);
    const attrs = testId ? { 'data-testid': testId } : {};

    const handleVisibilityChanged = (params: VisibilityChanged): void => {
        setVisible(params.isVisible);
    };

    const containerRef = useIntersectionObserver({
        onVisibilityChanged: handleVisibilityChanged,
    });

    return (
        <div
            {...attrs}
            className={classNames({
                [styles.spinner]: true,
                [styles.spinnerAnimation]: visible,
            })}
            ref={containerRef}
            style={{ height: size, width: size }}
        />
    );
};
