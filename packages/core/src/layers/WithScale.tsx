/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface WithScaleProps {
    rotation: number;
    scale: number;
    callback(): void;
}

const WithScale: React.FC<WithScaleProps> = ({ callback, children, rotation, scale }) => {
    React.useLayoutEffect(() => {
        callback();
    }, [rotation, scale]);
    return (<>{children}</>);
};

export default WithScale;
