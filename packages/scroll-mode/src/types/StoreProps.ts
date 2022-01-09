/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ScrollMode } from '@react-pdf-viewer/core';

export interface StoreProps {
    scrollMode: ScrollMode;
    switchScrollMode(scrollMode: ScrollMode): void;
}
