/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import HandToolIcon from './HandToolIcon';
import SelectionMode from './SelectionMode';
import selectionModePlugin, { SwitchSelectionModeMenuItemProps as SwitchSelectionModeMenuItemPropsType } from './selectionModePlugin';
import TextSelectionIcon from './TextSelectionIcon';

export default selectionModePlugin;

export {
    HandToolIcon,
    SelectionMode,
    TextSelectionIcon,
};

// Types
import { SwitchSelectionModeProps as SwitchSelectionModePropsType } from './SwitchSelectionMode';
export type SwitchSelectionModeMenuItemProps = SwitchSelectionModeMenuItemPropsType;
export type SwitchSelectionModeProps = SwitchSelectionModePropsType;
