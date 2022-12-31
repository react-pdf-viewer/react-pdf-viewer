/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Icon } from './Icon';

export const HelpIcon: React.FC = () => (
    <Icon size={16}>
        <path d="M0.500 12.001 A11.500 11.500 0 1 0 23.500 12.001 A11.500 11.500 0 1 0 0.500 12.001 Z" />
        <path d="M6.000 12.001 A6.000 6.000 0 1 0 18.000 12.001 A6.000 6.000 0 1 0 6.000 12.001 Z" />
        <path d="M21.423 5.406L17.415 9.414" />
        <path d="M14.587 6.585L18.607 2.565" />
        <path d="M5.405 21.424L9.413 17.416" />
        <path d="M6.585 14.588L2.577 18.596" />
        <path d="M18.602 21.419L14.595 17.412" />
        <path d="M17.419 14.58L21.428 18.589" />
        <path d="M2.582 5.399L6.588 9.406" />
        <path d="M9.421 6.581L5.412 2.572" />
    </Icon>
);
