/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext, useState } from 'react';

import Button from '../components/Button';
import { Toggle } from '../hooks/useToggle';
import DownArrowIcon from '../icons/DownArrowIcon';
import DownloadIcon from '../icons/DownloadIcon';
import FullScreenIcon from '../icons/FullScreenIcon';
import HandToolIcon from '../icons/HandToolIcon';
import HorizontalScrollingIcon from '../icons/HorizontalScrollingIcon';
import InfoIcon from '../icons/InfoIcon';
import LeftSidebarIcon from '../icons/LeftSidebarIcon';
import PrintIcon from '../icons/PrintIcon';
import RotateBackwardIcon from '../icons/RotateBackwardIcon';
import RotateForwardIcon from '../icons/RotateForwardIcon';
import TextSelectionIcon from '../icons/TextSelectionIcon';
import UpArrowIcon from '../icons/UpArrowIcon';
import VerticalScrollingIcon from '../icons/VerticalScrollingIcon';
import WrappedScrollingIcon from '../icons/WrappedScrollingIcon';
import ZoomInIcon from '../icons/ZoomInIcon';
import ZoomOutIcon from '../icons/ZoomOutIcon';
import { RenderToolbarSlot } from './ToolbarSlot';
import LocalizationContext from '../localization/LocalizationContext';
import LocalizationMap from '../localization/LocalizationMap';
import OpenFileButton from '../open/OpenFileButton';
import Modal from '../portal/Modal';
import Position from '../portal/Position';
import Tooltip from '../portal/Tooltip';
import PropertiesModal from '../property/PropertiesModal';
import Match from '../search/Match';
import SearchPopover from '../search/SearchPopover';
import ScrollMode from '../ScrollMode';
import SelectionMode from '../SelectionMode';
import SpecialZoomLevel from '../SpecialZoomLevel';
import PdfJs from '../vendors/PdfJs';
import { decrease, increase } from '../zoom/zoomingLevel';
import ZoomPopover from '../zoom/ZoomPopover';
import MoreActionsPopover from './MoreActionsPopover';

interface ToolbarProps {
    doc: PdfJs.PdfDocument;
    fileName: string;
    renderToolbar: RenderToolbarSlot;
    scale: number;
    scrollMode: ScrollMode;
    selectionMode: SelectionMode;
    onChangeScrollMode(mode: ScrollMode): void;
    onChangeSelectionMode(mode: SelectionMode): void;
    onDownload(): void;
    onFullScreen(): void;
    onJumpTo(pageIndex: number): void;
    onJumpToMatch(match: Match): void;
    onOpenFiles(files: FileList): void;
    onPrint(): void;
    onRotate(degree: number): void;
    onSearchFor(keyword: RegExp): void;
    onToggleSidebar(): void;
    onZoom(scale: number | SpecialZoomLevel): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const Toolbar: React.FC<ToolbarProps> = ({
    doc, fileName, scale, scrollMode, selectionMode,
    onChangeScrollMode, onChangeSelectionMode, onDownload, onFullScreen, onJumpTo,
    onJumpToMatch, onOpenFiles, onPrint, onRotate, onSearchFor, onToggleSidebar, onZoom,
    renderToolbar,
}) => {
    const l10n = useContext(LocalizationContext);
    const [isSidebarOpened, setSidebarOpened] = useState(false);

    const { numPages } = doc;

    const zoomOut = (): void => {
        const newLevel = decrease(scale);
        onZoom(newLevel);
    };

    const zoomIn = (): void => {
        const newLevel = increase(scale);
        onZoom(newLevel);
    };

    const jumpToFirstPage = (): void => onJumpTo(0);
    const jumpToLastPage = (): void => onJumpTo(numPages - 1);
    const toggleSidebar = (): void => {
        setSidebarOpened(!isSidebarOpened);
        onToggleSidebar();
    };

    const rotateForward = (): void => onRotate(90);
    const rotateBackward = (): void => onRotate(-90);
    const activateTextSelectionMode = (): void => onChangeSelectionMode(SelectionMode.Text);
    const activateHandMode = (): void => onChangeSelectionMode(SelectionMode.Hand);

    const setVerticalScrollMode = (): void => onChangeScrollMode(ScrollMode.Vertical);
    const setHorizontalScrollMode = (): void => onChangeScrollMode(ScrollMode.Horizontal);
    const setWrappedScrollMode = (): void => onChangeScrollMode(ScrollMode.Wrapped);

    const renderToggle = (): LocalizationMap => l10n.toolbar.toggleSidebar;
    const renderZoomOut = (): LocalizationMap => l10n.toolbar.zoomOut;
    const renderZoomIn = (): LocalizationMap => l10n.toolbar.zoomIn;
    const renderFullScreen = (): LocalizationMap => l10n.toolbar.fullScreen;
    const renderDownload = (): LocalizationMap => l10n.toolbar.download;
    const renderPrint = (): LocalizationMap => l10n.toolbar.print;
    const renderRotateClockwise = (): LocalizationMap => l10n.toolbar.rotateForward;
    const renderRotateCounterclockwise = (): LocalizationMap => l10n.toolbar.rotateBackward;
    const renderTextSelection = (): LocalizationMap => l10n.toolbar.textSelectionTool;
    const renderHandTool = (): LocalizationMap => l10n.toolbar.handTool;
    const renderVerticalScrolling = (): LocalizationMap => l10n.toolbar.verticalScrolling;
    const renderHorizontalScrolling = (): LocalizationMap => l10n.toolbar.horizontalScrolling;
    const renderDocumentProperties = (): LocalizationMap => l10n.toolbar.documentProperties;
    const renderWrappedScrolling = (): LocalizationMap => l10n.toolbar.wrappedScrolling;
    const renderPropertyButton = (toggle: Toggle): React.ReactElement => (
        <Tooltip
            position={Position.BottomCenter}
            target={<Button onClick={toggle}><InfoIcon /></Button>}
            content={renderDocumentProperties}
            offset={TOOLTIP_OFFSET}
        />
    );
    const renderPropertiesModal = (toggle: Toggle): React.ReactElement => (
        <PropertiesModal doc={doc} fileName={fileName} onToggle={toggle} />
    );

    return renderToolbar({
        documentPropertiesButton: (
            <Modal
                target={renderPropertyButton}
                content={renderPropertiesModal}
                closeOnClickOutside={true}
                closeOnEscape={true}
            />
        ),
        downloadButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={onDownload}><DownloadIcon /></Button>}
                content={renderDownload}
                offset={TOOLTIP_OFFSET}
            />
        ),
        fullScreenButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={onFullScreen}><FullScreenIcon /></Button>}
                content={renderFullScreen}
                offset={TOOLTIP_OFFSET}
            />
        ),
        handToolButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={activateHandMode} isSelected={selectionMode === SelectionMode.Hand}><HandToolIcon /></Button>
                }
                content={renderHandTool}
                offset={TOOLTIP_OFFSET}
            />
        ),
        horizontalScrollingButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={setHorizontalScrollMode} isSelected={scrollMode === ScrollMode.Horizontal}><HorizontalScrollingIcon /></Button>
                }
                content={renderHorizontalScrolling}
                offset={TOOLTIP_OFFSET}
            />
        ),
        moreActionsPopover: (
            <MoreActionsPopover
                doc={doc}
                fileName={fileName}
                scrollMode={scrollMode}
                selectionMode={selectionMode}
                onChangeScrollMode={onChangeScrollMode}
                onChangeSelectionMode={onChangeSelectionMode}
                onJumpToFirstPage={jumpToFirstPage}
                onJumpToLastPage={jumpToLastPage}
                onRotate={onRotate}
            />
        ),
        openFileButton: (
            <OpenFileButton onOpenFiles={onOpenFiles} />
        ),
        printButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={onPrint}><PrintIcon /></Button>}
                content={renderPrint}
                offset={TOOLTIP_OFFSET}
            />
        ),
        rotateClockwiseButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={rotateForward}><RotateForwardIcon /></Button>}
                content={renderRotateClockwise}
                offset={TOOLTIP_OFFSET}
            />
        ),
        rotateCounterclockwiseButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={rotateBackward}><RotateBackwardIcon /></Button>}
                content={renderRotateCounterclockwise}
                offset={TOOLTIP_OFFSET}
            />
        ),
        searchPopover: (
            <SearchPopover doc={doc} onJumpToMatch={onJumpToMatch} onSearchFor={onSearchFor} />
        ),
        textSelectionButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={activateTextSelectionMode} isSelected={selectionMode === SelectionMode.Text}><TextSelectionIcon /></Button>
                }
                content={renderTextSelection}
                offset={TOOLTIP_OFFSET}
            />
        ),
        toggleSidebarButton: (
            <Tooltip
                position={Position.BottomLeft}
                target={(
                    <Button onClick={toggleSidebar} isSelected={isSidebarOpened}>
                        <LeftSidebarIcon />
                    </Button>
                )}
                content={renderToggle}
                offset={TOOLTIP_OFFSET}
            />
        ),
        verticalScrollingButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={setVerticalScrollMode} isSelected={scrollMode === ScrollMode.Vertical}><VerticalScrollingIcon /></Button>
                }
                content={renderVerticalScrolling}
                offset={TOOLTIP_OFFSET}
            />
        ),
        zoomInButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={zoomIn}><ZoomInIcon /></Button>}
                content={renderZoomIn}
                offset={TOOLTIP_OFFSET}
            />
        ),
        zoomOutButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={zoomOut}><ZoomOutIcon /></Button>}
                content={renderZoomOut}
                offset={TOOLTIP_OFFSET}
            />
        ),
        zoomPopover: (
            <ZoomPopover scale={scale} onZoom={onZoom} />
        ),
        wrappedScrollingButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={
                    <Button onClick={setWrappedScrollMode} isSelected={scrollMode === ScrollMode.Wrapped}><WrappedScrollingIcon /></Button>
                }
                content={renderWrappedScrolling}
                offset={TOOLTIP_OFFSET}
            />
        ),
    });
};

export default Toolbar;
