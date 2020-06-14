/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useLayoutEffect } from 'react';

interface WithScaleProps {
    rotation: number;
    scale: number;
    callback(): void;
}

const WithScale: React.FC<WithScaleProps> = ({ callback, children, rotation, scale }) => {
    useLayoutEffect(() => {
        callback();
    }, [rotation, scale]);
    return (<>{children}</>);
};

export default WithScale;
