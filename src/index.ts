/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import Button from './Button';
import { Toggle } from './hooks/useToggle';
import Icon from './icons/Icon';
import defaultLayout from './layouts/defaultLayout';
import defaultToolbar from './layouts/defaultToolbar';
import Slot from './layouts/Slot';
import ToolbarSlot, { RenderToolbar, RenderToolbarSlot } from './layouts/ToolbarSlot';
import LocalizationMap from './localization/LocalizationMap';
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
    LocalizationMap,
    MenuDivider,
    MenuItem,
    Modal,
    Popover,
    Position,
    RenderToolbar,
    RenderToolbarSlot,
    Slot,
    Toggle,
    ToolbarSlot,
    Tooltip,
    Worker,
};
