/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Plugin } from '@react-pdf-viewer/core';
import * as React from 'react';

// Plugin
export interface AttachmentPlugin extends Plugin {
    Attachments: () => React.ReactElement;
}

export function attachmentPlugin(): AttachmentPlugin;
