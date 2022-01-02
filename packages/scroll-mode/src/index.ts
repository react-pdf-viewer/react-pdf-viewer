/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Types
export type { SwitchScrollModeProps } from './SwitchScrollMode';
export type { RenderSwitchScrollModeProps } from './types/RenderSwitchScrollModeProps';

// Structs
export { ScrollMode } from './structs/ScrollMode';

// Plugin
export * from './scrollModePlugin';

// Components
export { HorizontalScrollingIcon } from './HorizontalScrollingIcon';
export { VerticalScrollingIcon } from './VerticalScrollingIcon';
export { WrappedScrollingIcon } from './WrappedScrollingIcon';
