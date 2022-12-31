/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Icon } from '@react-pdf-viewer/core';
import * as React from 'react';

export const DownloadIcon: React.FC = () => (
    <Icon size={16}>
        <path d="M5.5,11.5c-.275,0-.341.159-.146.354l6.292,6.293a.5.5,0,0,0,.709,0l6.311-6.275c.2-.193.13-.353-.145-.355L15.5,11.5V1.5a1,1,0,0,0-1-1h-5a1,1,0,0,0-1,1V11a.5.5,0,0,1-.5.5Z" />
        <path d="M23.5,18.5v4a1,1,0,0,1-1,1H1.5a1,1,0,0,1-1-1v-4" />
    </Icon>
);
