/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Slot from './Slot';
import { RenderToolbar } from './ToolbarSlot';

export type Layout = (
    isSidebarOpened: boolean,
    container: Slot,
    main: Slot,
    toolbar: RenderToolbar,
    sidebar: Slot,
) => React.ReactElement;
