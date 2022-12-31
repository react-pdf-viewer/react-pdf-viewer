/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { DefaultToobar } from './DefaultToobar';
import type { ToolbarSlot } from './types/ToolbarSlot';

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => React.ReactElement;

export interface ToolbarProps {
    children?: RenderToolbarSlot;
}

export const Toolbar: React.FC<{
    children?: RenderToolbarSlot;
    slot: ToolbarSlot;
}> = ({ children, slot }) => {
    const render = children || DefaultToobar;
    return render(slot);
};
