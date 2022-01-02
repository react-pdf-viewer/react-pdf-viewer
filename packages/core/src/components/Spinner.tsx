/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { classNames } from '../utils/classNames';
import type { VisibilityChanged } from '../types/VisibilityChanged';

export const Spinner: React.FC<{
    size?: string;
}> = ({ size = '4rem' }) => {
    const [visible, setVisible] = React.useState(false);

    const handleVisibilityChanged = (params: VisibilityChanged): void => {
        setVisible(params.isVisible);
    };

    const containerRef = useIntersectionObserver({
        onVisibilityChanged: handleVisibilityChanged,
    });

    return (
        <div
            className={classNames({
                'rpv-core__spinner': true,
                'rpv-core__spinner--animating': visible,
            })}
            ref={containerRef}
            style={{ height: size, width: size }}
        />
    );
};
