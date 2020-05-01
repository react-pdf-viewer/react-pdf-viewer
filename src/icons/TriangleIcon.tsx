/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Icon from './Icon';

const TriangleIcon: React.FC<{}> = () => {
    return (
        <Icon size={16}>
            <path d='M2.5 22.995L12 6.005 21.5 22.995 2.5 22.995z' />
        </Icon>
    );
};

export default TriangleIcon;
