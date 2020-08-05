/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

export interface ThumbnailPlugin extends Plugin {
    Thumbnails: () => ReactElement;
}

export default function thumbnailPlugin(): ThumbnailPlugin;
