/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from '@react-pdf-viewer/core';

const OpenFileIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path d="M12.5 4.5L12.5 19.5" />
            <path d="M18 10L12.5 4.5 7 10" />
            <path d="M17.5.5h5a1,1,0,0,1,1,1v21a1,1,0,0,1-1,1h-5" />
            <path d="M6.5.5h-5a1,1,0,0,0-1,1v21a1,1,0,0,0,1,1h5" />
        </Icon>
    );
};

export default OpenFileIcon;
