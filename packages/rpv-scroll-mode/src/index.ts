/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import HorizontalScrollingIcon from './HorizontalScrollingIcon';
import ScrollMode from './ScrollMode';
import scrollModePlugin from './scrollModePlugin';
import VerticalScrollingIcon from './VerticalScrollingIcon';
import WrappedScrollingIcon from './WrappedScrollingIcon';

export default scrollModePlugin;

export {
    HorizontalScrollingIcon,
    ScrollMode,
    VerticalScrollingIcon,
    WrappedScrollingIcon,
};

// Types
import { RenderSwitchScrollModeProps as RenderSwitchScrollModePropsType, SwitchScrollModeProps as SwitchScrollModePropsType } from './SwitchScrollMode';
export type RenderSwitchScrollModeProps = RenderSwitchScrollModePropsType;
export type SwitchScrollModeProps = SwitchScrollModePropsType;
