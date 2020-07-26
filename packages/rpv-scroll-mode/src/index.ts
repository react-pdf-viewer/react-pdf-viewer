/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import HorizontalScrollingIcon from './HorizontalScrollingIcon';
import ScrollMode from './ScrollMode';
import scrollModePlugin, { SwitchScrollModeMenuItemProps as SwitchScrollModeMenuItemPropsType } from './scrollModePlugin';
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
import { SwitchScrollModeProps as SwitchScrollModePropsType } from './SwitchScrollMode';
export type SwitchScrollModeMenuItemProps = SwitchScrollModeMenuItemPropsType;
export type SwitchScrollModeProps = SwitchScrollModePropsType;
