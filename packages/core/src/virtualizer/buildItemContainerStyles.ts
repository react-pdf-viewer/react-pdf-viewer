/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { ScrollMode } from '../structs/ScrollMode';
import { type Rect } from '../types/Rect';
import { type VirtualItem } from './VirtualItem';

export const buildItemContainerStyles = (
    item: VirtualItem,
    parentRect: Rect,
    scrollMode: ScrollMode,
): React.CSSProperties =>
    scrollMode !== ScrollMode.Page
        ? {}
        : {
              // Size
              height: `${parentRect.height}px`,
              width: '100%',
              // Absolute position
              position: 'absolute',
              top: 0,
              transform: `translateY(${item.start.top}px)`,
          };
