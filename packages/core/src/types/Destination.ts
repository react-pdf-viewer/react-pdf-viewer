/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '../structs/SpecialZoomLevel';

export type DestinationOffsetFromViewport = (viewportWidth: number, viewportHeight: number) => number;

export interface Destination {
    bottomOffset: number | DestinationOffsetFromViewport;
    label?: string;
    leftOffset: number | DestinationOffsetFromViewport;
    pageIndex: number;
    scaleTo?: number | SpecialZoomLevel;
}
