/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';

export type DestinationOffsetFromViewport = (viewportWidth: number, viewportHeight: number) => number;

export interface Destination {
    pageIndex: number;
    bottomOffset: number | DestinationOffsetFromViewport;
    leftOffset: number | DestinationOffsetFromViewport;
    scaleTo?: number | SpecialZoomLevel;
}
