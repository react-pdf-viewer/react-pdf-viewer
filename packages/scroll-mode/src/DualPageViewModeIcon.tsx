/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const DualPageViewModeIcon: React.FC = () => (
    <Icon size={16}>
        <rect x="0.5" y="0.497" width="22" height="22" rx="1" ry="1" />
        <line x1="11.5" y1="0.497" x2="11.5" y2="22.497" />
    </Icon>
);
