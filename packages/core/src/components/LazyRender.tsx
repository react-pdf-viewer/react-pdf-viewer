/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { type VisibilityChanged } from '../types/VisibilityChanged';

export const LazyRender: React.FC<{
    attrs?: React.HTMLAttributes<HTMLDivElement>;
    children?: React.ReactNode;
    testId?: string;
}> = ({ attrs, children, testId }) => {
    const [visible, setVisible] = React.useState(false);
    const containerAttrs = testId ? { ...attrs, 'data-testid': testId } : attrs;

    const handleVisibilityChanged = (params: VisibilityChanged): void => {
        if (params.isVisible) {
            setVisible(true);
        }
    };

    const containerRef = useIntersectionObserver({
        once: true,
        onVisibilityChanged: handleVisibilityChanged,
    });

    return (
        <div ref={containerRef} {...containerAttrs}>
            {visible && children}
        </div>
    );
};
