/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from '@react-pdf-viewer/core';

export const DownloadIcon: React.FC = () => (
    <Icon size={16}>
        <path d="M11.5 19.5L11.5 5" />
        <path d="M17 14L11.5 19.5 6 14" />
        <path d="M17.5.5h5a1,1,0,0,1,1,1v21a1,1,0,0,1-1,1h-5" />
        <path d="M6.5.5h-5a1,1,0,0,0-1,1v21a1,1,0,0,0,1,1h5" />
    </Icon>
);
