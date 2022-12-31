/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from './Icon';

export const ParagraphIcon: React.FC = () => (
    <Icon size={16}>
        <path d="M17.5 0.498L17.5 23.498" />
        <path d="M10.5 0.498L10.5 23.498" />
        <path d="M23.5.5H6.5a6,6,0,0,0,0,12h4" />
    </Icon>
);
