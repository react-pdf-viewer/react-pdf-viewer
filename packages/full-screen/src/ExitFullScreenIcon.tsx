/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const ExitFullScreenIcon: React.FC = () => (
    <Icon size={16}>
        <path d="M11.5 23.499L11.5 14.499" />
        <path d="M7.5 18.499L11.5 14.499 15.5 18.499" />
        <path d="M11.5 1.499L11.5 10.499" />
        <path d="M7.5 6.499L11.5 10.499 15.5 6.499" />
        <path d="M20.5 12.499L1.5 12.499" />
    </Icon>
);
