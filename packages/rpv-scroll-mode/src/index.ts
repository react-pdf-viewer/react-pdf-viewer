/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export { default as HorizontalScrollingIcon } from './HorizontalScrollingIcon';
export { default as ScrollMode } from './ScrollMode';
import scrollModePlugin from './scrollModePlugin';
export { default as VerticalScrollingIcon } from './VerticalScrollingIcon';
export { default as WrappedScrollingIcon } from './WrappedScrollingIcon';

export default scrollModePlugin;

// Types
export type { SwitchScrollModeMenuItemProps } from './scrollModePlugin';
export type { SwitchScrollModeProps } from './SwitchScrollMode';
