/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import styles from '../styles/skeleton.module.css';

interface SkeletonProps {
    children: ({
        attributes,
        ref,
    }: {
        attributes: React.HTMLAttributes<HTMLElement>;
        ref: React.RefCallback<HTMLElement>;
    }) => React.ReactElement;
}

export const Skeleton = ({ children }: SkeletonProps) => {
    const [node, setNode] = React.useState<HTMLElement | null>(null);

    const ref = React.useCallback((nodeEle: HTMLElement | null) => {
        setNode(nodeEle);
    }, []);

    React.useEffect(() => {
        if (!node) {
            return;
        }
        const animation = node.animate(
            [
                {
                    offset: 0,
                    opacity: 1,
                },
                {
                    offset: 0.5,
                    opacity: 0.5,
                },
                {
                    offset: 1,
                    opacity: 1,
                },
            ],
            {
                duration: 2 * 1000,
                easing: 'ease-in-out',
                iterations: Number.MAX_VALUE,
            },
        );
        return () => {
            animation.cancel();
        };
    }, [node]);

    return children({
        attributes: {
            className: styles.skeleton,
        },
        ref,
    });
};
