/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { DestinationOffsetFromViewport } from '@react-pdf-viewer/core';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import { Trigger } from '../structs/Trigger';
import type { HighlightState } from './HighlightState';

export interface StoreProps {
    jumpToDestination?: (
        pageIndex: number,
        bottomOffset: number | DestinationOffsetFromViewport,
        leftOffset: number | DestinationOffsetFromViewport,
        scaleTo?: number | SpecialZoomLevel
    ) => void;
    getPagesContainer?(): HTMLElement;
    highlightState: HighlightState;
    rotation?: number;
    trigger: Trigger;
}
