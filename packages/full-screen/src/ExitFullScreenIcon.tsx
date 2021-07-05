/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from '@react-pdf-viewer/core';

const ExitFullScreenIcon: React.FC = () => {
    return (
        <Icon size={16}>
            <path d="M11.5 23.499L11.5 14.499" />
            <path d="M7.5 18.499L11.5 14.499 15.5 18.499" />
            <path d="M11.5 1.499L11.5 10.499" />
            <path d="M7.5 6.499L11.5 10.499 15.5 6.499" />
            <path d="M20.5 12.499L1.5 12.499" />
        </Icon>
    );
};

export default ExitFullScreenIcon;
