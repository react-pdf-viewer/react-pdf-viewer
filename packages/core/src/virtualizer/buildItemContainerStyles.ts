/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
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
