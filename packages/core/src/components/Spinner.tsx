/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
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
                'rpv-core__spinner': true,
                'rpv-core__spinner--animating': visible,
            })}
            ref={containerRef}
            style={{ height: size, width: size }}
        />
    );
};
