/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Button from './components/Button';
import Menu from './components/Menu';
import MenuDivider from './components/MenuDivider';
import MenuItem from './components/MenuItem';
import { Toggle } from './hooks/useToggle';
import DownArrowIcon from './icons/DownArrowIcon';
import HandToolIcon from './icons/HandToolIcon';
import HorizontalScrollingIcon from './icons/HorizontalScrollingIcon';
import InfoIcon from './icons/InfoIcon';
import MoreIcon from './icons/MoreIcon';
import RotateBackwardIcon from './icons/RotateBackwardIcon';
import RotateForwardIcon from './icons/RotateForwardIcon';
import TextSelectionIcon from './icons/TextSelectionIcon';
import UpArrowIcon from './icons/UpArrowIcon';
import VerticalScrollingIcon from './icons/VerticalScrollingIcon';
import WrappedScrollingIcon from './icons/WrappedScrollingIcon';
import LocalizationContext from './localization/LocalizationContext';
import PdfJs from './PdfJs';
import Modal from './portal/Modal';
import Popover from './portal/Popover';
import Position from './portal/Position';
import Tooltip from './portal/Tooltip';
import PropertiesModal from './property/PropertiesModal';
import ScrollMode from './ScrollMode';
import SelectionMode from './SelectionMode';

interface MoreActionsPopoverProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    scrollMode: ScrollMode;
    selectionMode: SelectionMode;
    onChangeScrollMode(mode: ScrollMode): void;
    onChangeSelectionMode(mode: SelectionMode): void;
    onJumpToFirstPage(): void;
    onJumpToLastPage(): void;
    onRotate(degree: number): void;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

const MoreActionsPopover: React.FC<MoreActionsPopoverProps> = ({
    doc, fileName, scrollMode, selectionMode,
    onChangeScrollMode, onChangeSelectionMode, onJumpToFirstPage, onJumpToLastPage, onRotate,
}) => {
    const l10n = React.useContext(LocalizationContext);

    const renderMoreActions = () => l10n.toolbar.moreActions;
    const renderTarget = (toggle: Toggle, opened: boolean) => (
        <Tooltip
            position={Position.BottomRight}
            target={<Button onClick={toggle} isSelected={opened}><MoreIcon /></Button>}
            content={renderMoreActions}
            offset={PORTAL_OFFSET}
        />
    );

    const renderPropertyMenu = (toggle: Toggle) => (
        <MenuItem icon={<InfoIcon />} onClick={toggle}>{l10n.toolbar.documentProperties}</MenuItem>
    );
    const renderPropertiesModal = (toggle: Toggle) => (
        <PropertiesModal doc={doc} fileName={fileName} onToggle={toggle} />
    );
    const renderContent = (toggle: Toggle) => {
        const jumpToFirstPage = () => {
            toggle();
            onJumpToFirstPage();
        };
        const jumpToLastPage = () => {
            toggle();
            onJumpToLastPage();
        };
        const rotateForward = () => {
            toggle();
            onRotate(90);
        };
        const rotateBackward = () => {
            toggle();
            onRotate(-90);
        };
        const activateTextSelectionMode = () => {
            toggle();
            onChangeSelectionMode(SelectionMode.Text);
        };
        const activateHandMode = () => {
            toggle();
            onChangeSelectionMode(SelectionMode.Hand);
        };
        const activateScrollMode = (mode: ScrollMode) => {
            toggle();
            onChangeScrollMode(mode);
        };
        const setVerticalScrollMode = () => activateScrollMode(ScrollMode.Vertical);
        const setHorizontalScrollMode = () => activateScrollMode(ScrollMode.Horizontal);
        const setWrappedScrollMode = () => activateScrollMode(ScrollMode.Wrapped);

        return (
            <Menu>
                <MenuItem icon={<UpArrowIcon />} onClick={jumpToFirstPage}>
                    {l10n.toolbar.goToFirstPage}
                </MenuItem>
                <MenuItem icon={<DownArrowIcon />} onClick={jumpToLastPage}>
                    {l10n.toolbar.goToLastPage}
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<RotateForwardIcon />} onClick={rotateForward}>
                    {l10n.toolbar.rotateForward}
                </MenuItem>
                <MenuItem icon={<RotateBackwardIcon />} onClick={rotateBackward}>
                    {l10n.toolbar.rotateBackward}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    checked={selectionMode === SelectionMode.Text}
                    icon={<TextSelectionIcon />}
                    onClick={activateTextSelectionMode}
                >
                    {l10n.toolbar.textSelectionTool}
                </MenuItem>
                <MenuItem
                    checked={selectionMode === SelectionMode.Hand}
                    icon={<HandToolIcon />}
                    onClick={activateHandMode}
                >
                    {l10n.toolbar.handTool}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    checked={scrollMode === ScrollMode.Vertical}
                    icon={<VerticalScrollingIcon />}
                    onClick={setVerticalScrollMode}
                >
                    {l10n.toolbar.verticalScrolling}
                </MenuItem>
                <MenuItem
                    checked={scrollMode === ScrollMode.Horizontal}
                    icon={<HorizontalScrollingIcon />}
                    onClick={setHorizontalScrollMode}
                >
                    {l10n.toolbar.horizontalScrolling}
                </MenuItem>
                <MenuItem
                    checked={scrollMode === ScrollMode.Wrapped}
                    icon={<WrappedScrollingIcon />}
                    onClick={setWrappedScrollMode}
                >
                    {l10n.toolbar.wrappedScrolling}
                </MenuItem>
                <MenuDivider />
                <Modal
                    target={renderPropertyMenu}
                    content={renderPropertiesModal}
                    closeOnClickOutside={true}
                    closeOnEscape={true}
                />
            </Menu>
        );
    };

    return (
        <Popover
            position={Position.BottomRight}
            target={renderTarget}
            content={renderContent}
            offset={PORTAL_OFFSET}
            closeOnClickOutside={true}
            closeOnEscape={true}
        />
    );
};

export { ScrollMode };
export default MoreActionsPopover;
