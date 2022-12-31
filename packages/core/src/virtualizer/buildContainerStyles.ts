/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import type { Rect } from '../types/Rect';

export const buildContainerStyles = (totalSize: Rect, scrollMode: ScrollMode): React.CSSProperties => {
    switch (scrollMode) {
        case ScrollMode.Horizontal:
            return {
                position: 'relative',
                height: '100%',
                width: `${totalSize.width}px`,
            };
        case ScrollMode.Vertical:
        default:
            return {
                position: 'relative',
                height: `${totalSize.height}px`,
                width: '100%',
            };
    }
};
