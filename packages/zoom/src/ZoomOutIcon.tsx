/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const ZoomOutIcon: React.FC = () => (
    <Icon ignoreDirection={true} size={16}>
        <path
            d={`M10.5,0.499c5.523,0,10,4.477,10,10s-4.477,10-10,10s-10-4.477-10-10S4.977,0.499,10.5,0.499z
            M23.5,23.499
            l-5.929-5.929
            M5.5,10.499h10`}
        />
    </Icon>
);
