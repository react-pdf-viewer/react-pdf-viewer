/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export { default as HandToolIcon } from './HandToolIcon';
export { default as SelectionMode } from './SelectionMode';
import selectionModePlugin from './selectionModePlugin';
export { default as TextSelectionIcon } from './TextSelectionIcon';

export default selectionModePlugin;

// Types
export type { SelectionModePluginProps, SwitchSelectionModeMenuItemProps } from './selectionModePlugin';
export type { SwitchSelectionModeProps } from './SwitchSelectionMode';
