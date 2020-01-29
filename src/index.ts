/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import Button from './Button';
import { Toggle as ToggleType } from './hooks/useToggle';
import Icon from './icons/Icon';
import defaultLayout from './layouts/defaultLayout';
import defaultToolbar from './layouts/defaultToolbar';
import { default as ISlot } from './layouts/Slot';
import { default as IToolbarSlot, RenderToolbar as RenderToolbarType, RenderToolbarSlot as RenderToolbarSlotType } from './layouts/ToolbarSlot';
import { default as ILocalizationMap } from './localization/LocalizationMap';
import MenuDivider from './menu/MenuDivider';
import MenuItem from './menu/MenuItem';
import Modal from './portal/Modal';
import Popover from './portal/Popover';
import Position from './portal/Position';
import Tooltip from './portal/Tooltip';
import Viewer from './Viewer';
import Worker from './Worker';

export default Viewer;
export {
    Button,
    defaultLayout,
    defaultToolbar,
    Icon,
    MenuDivider,
    MenuItem,
    Modal,
    Popover,
    Position,
    Tooltip,
    Worker,
};
export type LocalizationMap = ILocalizationMap;
export type RenderToolbar = RenderToolbarType;
export type RenderToolbarSlot = RenderToolbarSlotType;
export type Slot = ISlot;
export type Toggle = ToggleType;
export type ToolbarSlot = IToolbarSlot;
