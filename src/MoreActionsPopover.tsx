/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Button from './Button';
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
import MenuDivider from './menu/MenuDivider';
import MenuItem from './menu/MenuItem';
import PdfJs from './PdfJs';
import Modal from './portal/Modal';
import Popover from './portal/Popover';
import Position from './portal/Position';
import Tooltip from './portal/Tooltip';
import PropertiesModal from './property/PropertiesModal';

enum ScrollMode {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
    Wrapped = 'Wrapped',
}

interface MoreActionsPopoverProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    onChangeScrollMode(mode: ScrollMode): void;
    onJumpToFirstPage(): void;
    onJumpToLastPage(): void;
    onRotate(degree: number): void;
    onToggleDragScroll(enabled: boolean): void;
}

const PORTAL_OFFSET = { left: 0, top: 8 };

const MoreActionsPopover: React.FC<MoreActionsPopoverProps> = ({
    doc, fileName, onChangeScrollMode, onJumpToFirstPage, onJumpToLastPage, onRotate, onToggleDragScroll,
}) => {
    const l10n = React.useContext(LocalizationContext);
    const [enableDragScroll, setEnableDragScroll] = React.useState(false);
    const [scrollMode, setScrollMode] = React.useState<ScrollMode>(ScrollMode.Vertical);

    const renderMoreActions = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.moreActions}</div>);
    const renderTarget = (toggle: Toggle, opened: boolean) => (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={toggle} isSelected={opened}><MoreIcon /></Button>}
            content={renderMoreActions}
            offset={PORTAL_OFFSET}
        />
    );

    const renderPropertyMenu = (toggle: Toggle) => (
        <MenuItem icon={<InfoIcon />} onClick={toggle}>{l10n.moreActions.documentProperties}</MenuItem>
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
            setEnableDragScroll(false);
            onToggleDragScroll(false);
        };
        const activateHandMode = () => {
            toggle();
            setEnableDragScroll(true);
            onToggleDragScroll(true);
        };
        const activateScrollMode = (mode: ScrollMode) => {
            toggle();
            setScrollMode(mode);
            onChangeScrollMode(mode);
        };
        const setVerticalScrollMode = () => activateScrollMode(ScrollMode.Vertical);
        const setHorizontalScrollMode = () => activateScrollMode(ScrollMode.Horizontal);
        const setWrappedScrollMode = () => activateScrollMode(ScrollMode.Wrapped);

        return (
            <div style={{ padding: '8px 0' }}>
                <ul
                    style={{
                        listStyleType: 'none',
                        margin: 0,
                        padding: 0,
                    }}
                >
                    <MenuItem icon={<UpArrowIcon />} onClick={jumpToFirstPage}>
                        {l10n.moreActions.goToFirstPage}
                    </MenuItem>
                    <MenuItem icon={<DownArrowIcon />} onClick={jumpToLastPage}>
                        {l10n.moreActions.goToLastPage}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<RotateForwardIcon />} onClick={rotateForward}>
                        {l10n.moreActions.rotateForward}
                    </MenuItem>
                    <MenuItem icon={<RotateBackwardIcon />} onClick={rotateBackward}>
                        {l10n.moreActions.rotateBackward}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        checked={!enableDragScroll}
                        icon={<TextSelectionIcon />}
                        onClick={activateTextSelectionMode}
                    >
                        {l10n.moreActions.textSelectionTool}
                    </MenuItem>
                    <MenuItem
                        checked={enableDragScroll}
                        icon={<HandToolIcon />}
                        onClick={activateHandMode}
                    >
                        {l10n.moreActions.handTool}
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        checked={scrollMode === ScrollMode.Vertical}
                        icon={<VerticalScrollingIcon />}
                        onClick={setVerticalScrollMode}
                    >
                        {l10n.moreActions.verticalScrolling}
                    </MenuItem>
                    <MenuItem
                        checked={scrollMode === ScrollMode.Horizontal}
                        icon={<HorizontalScrollingIcon />}
                        onClick={setHorizontalScrollMode}
                    >
                        {l10n.moreActions.horizontalScrolling}
                    </MenuItem>
                    <MenuItem
                        checked={scrollMode === ScrollMode.Wrapped}
                        icon={<WrappedScrollingIcon />}
                        onClick={setWrappedScrollMode}
                    >
                        {l10n.moreActions.wrappedScrolling}
                    </MenuItem>
                    <MenuDivider />
                    <Modal
                        target={renderPropertyMenu}
                        content={renderPropertiesModal}
                        closeOnClickOutside={true}
                        closeOnEscape={true}
                    />
                </ul>
            </div>
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
