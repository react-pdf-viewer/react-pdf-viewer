/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface IVisibilityChanged {
    isVisible: boolean;
    ratio: number;
}

interface ObserverProps {
    threshold?: number | number[];
    onVisibilityChanged(params: IVisibilityChanged): void;
}

const Observer: React.FC<ObserverProps> = ({ children, threshold, onVisibilityChanged }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const isVisible = entry.isIntersecting;
                const ratio = entry.intersectionRatio;
                onVisibilityChanged({ isVisible, ratio });
            });
        }, {
            threshold: threshold || 0,
        });
        const container = containerRef.current;
        if (!container) {
            return;
        }
        io.observe(container);

        return () => {
            io.unobserve(container);
        };
    }, []);

    return (
        <div ref={containerRef}>{children}</div>
    );
};

export default Observer;
export type VisibilityChanged = IVisibilityChanged;
