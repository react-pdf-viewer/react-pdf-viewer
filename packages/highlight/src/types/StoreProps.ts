/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import type { DestinationOffsetFromViewport } from '@react-pdf-viewer/core';
import { HighlightState } from '../HighlightState';

export interface StoreProps {
    jumpToDestination?: (
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo?: number | SpecialZoomLevel
    ) => void;
    getPagesContainer?(): HTMLElement;
    rotation?: number;
    highlightState: HighlightState;
}
