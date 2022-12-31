/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from './Icon';

export const KeyIcon: React.FC = () => (
    <Icon size={16}>
        <path d="M4.000 18.500 A1.500 1.500 0 1 0 7.000 18.500 A1.500 1.500 0 1 0 4.000 18.500 Z" />
        <path d="M20.5.5l-9.782,9.783a7,7,0,1,0,3,3L17,10h1.5V8.5L19,8h1.5V6.5L21,6h1.5V4.5l1-1V.5Z" />
    </Icon>
);
