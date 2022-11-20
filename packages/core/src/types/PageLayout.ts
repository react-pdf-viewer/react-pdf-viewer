/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Rect } from './Rect';

export interface PageLayout {
    buildPageStyles?: ({ numPages, pageIndex }: { numPages: number; pageIndex: number }) => React.CSSProperties;
    tranformSize?: ({ numPages, pageIndex, size }: { numPages: number; pageIndex: number; size: Rect }) => Rect;
}
