/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

export const WithScale: React.FC<{
    rotation: number;
    scale: number;
    callback(): void;
}> = ({ callback, children, rotation, scale }) => {
    useIsomorphicLayoutEffect(() => {
        callback();
    }, [rotation, scale]);

    return <>{children}</>;
};
