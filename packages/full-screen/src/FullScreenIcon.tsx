/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from '@react-pdf-viewer/core';

const FullScreenIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path d='M0.5 12L23.5 12' />
            <path d='M11.5 1L11.5 23' />
            <path d='M8.5 4L11.5 1 14.5 4' />
            <path d='M20.5 9L23.5 12 20.5 15' />
            <path d='M3.5 15L0.5 12 3.5 9' />
            <path d='M14.5 20L11.5 23 8.5 20' />
        </Icon>
    );
};

export default FullScreenIcon;
