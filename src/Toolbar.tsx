/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import Button from './Button';
import DownloadIcon from './icons/DownloadIcon';
import FullScreenIcon from './icons/FullScreenIcon';
import LeftSidebarIcon from './icons/LeftSidebarIcon';
import NextIcon from './icons/NextIcon';
import PreviousIcon from './icons/PreviousIcon';
import PrintIcon from './icons/PrintIcon';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import { RenderToolbarSlot } from './layouts/ToolbarSlot';
import LocalizationContext from './localization/LocalizationContext';
import MoreActionsPopover, { ScrollMode } from './MoreActionsPopover';
import OpenFileButton from './open/OpenFileButton';
import PdfJs from './PdfJs';
import Position from './portal/Position';
import Tooltip from './portal/Tooltip';
import Match from './search/Match';
import SearchPopover from './search/SearchPopover';
import SelectionMode from './SelectionMode';
import { decrease, increase, SpecialLevel } from './zoom/zoomingLevel';
import ZoomPopover from './zoom/ZoomPopover';

interface ToolbarProps {
    currentPage: number;
    doc: PdfJs.PdfDocument;
    fileName: string;
    renderToolbar: RenderToolbarSlot;
    scale: number;
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
    onZoom(scale: number | SpecialLevel): void;
}

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const Toolbar: React.FC<ToolbarProps> = ({
    currentPage, doc, fileName, scale, selectionMode,
    onChangeScrollMode, onChangeSelectionMode, onDownload, onFullScreen, onJumpTo,
    onJumpToMatch, onOpenFiles, onPrint, onRotate, onSearchFor, onToggleSidebar, onZoom,
    renderToolbar,
}) => {
    const l10n = React.useContext(LocalizationContext);
    const [pageTextboxFocused, setPageTextboxFocused] = React.useState(false);
    const [editingPage, setEditingPage] = React.useState(currentPage);
    const [isSidebarOpened, setSidebarOpened] = React.useState(false);

    const { numPages } = doc;

    const zoomOut = () => {
        const newLevel = decrease(scale);
        onZoom(newLevel);
    };

    const zoomIn = () => {
        const newLevel = increase(scale);
        onZoom(newLevel);
    };

    const gotoNextPage = () => {
        const nextPage = currentPage + 1;
        if (nextPage < numPages) {
            setEditingPage(nextPage);
            onJumpTo(nextPage);
        }
    };

    const gotoPreviousPage = () => {
        const previousPage = currentPage - 1;
        if (previousPage >= 0) {
            setEditingPage(previousPage);
            onJumpTo(previousPage);
        }
    };

    const changePage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = parseInt(e.target.value, 10);
        if (newPage > 0 && newPage <= numPages) {
            setEditingPage(newPage - 1);
        }
    };

    const focusPageTextbox = () => {
        setPageTextboxFocused(true);
        setEditingPage(currentPage);
    };

    const blurPageTextbox = () => {
        setPageTextboxFocused(false);
    };

    const keydownPage = (e: React.KeyboardEvent) => {
        switch (e.keyCode) {
            // Up key is pressed
            case 38: gotoPreviousPage(); break;
            // Down key
            case 40: gotoNextPage(); break;
            // Enter key
            case 13: onJumpTo(editingPage); break;
            default: break;
        }
    };

    const jumpToFirstPage = () => onJumpTo(0);
    const jumpToLastPage = () => onJumpTo(numPages - 1);
    const toggleSidebar = () => {
        setSidebarOpened(!isSidebarOpened);
        onToggleSidebar();
    };

    const renderToggle = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.toggleSidebar}</div>);
    const renderPreviousPage = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.previousPage}</div>);
    const renderNextPage = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.nextPage}</div>);
    const renderZoomOut = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.zoomOut}</div>);
    const renderZoomIn = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.zoomIn}</div>);
    const renderFullScreen = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.fullScreen}</div>);
    const renderDownload = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.download}</div>);
    const renderPrint = () => (<div style={{ padding: '8px' }}>{l10n.toolbar.print}</div>);

    return renderToolbar({
        currentPage,
        currentPageInput: (
            <input
                type="text"
                value={pageTextboxFocused ? (editingPage + 1) : (currentPage + 1)}
                onChange={changePage}
                onFocus={focusPageTextbox}
                onBlur={blurPageTextbox}
                onKeyDown={keydownPage}
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    padding: '4px',
                    width: '50px',
                }}
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
        moreActionsPopover: (
            <MoreActionsPopover
                doc={doc}
                fileName={fileName}
                selectionMode={selectionMode}
                onChangeScrollMode={onChangeScrollMode}
                onChangeSelectionMode={onChangeSelectionMode}
                onJumpToFirstPage={jumpToFirstPage}
                onJumpToLastPage={jumpToLastPage}
                onRotate={onRotate}
            />
        ),
        nextPageButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={gotoNextPage}><NextIcon /></Button>}
                content={renderNextPage}
                offset={TOOLTIP_OFFSET}
            />
        ),
        numPages,
        openFileButton: (
            <OpenFileButton onOpenFiles={onOpenFiles} />
        ),
        previousPageButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={gotoPreviousPage}><PreviousIcon /></Button>}
                content={renderPreviousPage}
                offset={TOOLTIP_OFFSET}
            />
        ),
        printButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={<Button onClick={onPrint}><PrintIcon /></Button>}
                content={renderPrint}
                offset={TOOLTIP_OFFSET}
            />
        ),
        searchPopover: (
            <SearchPopover doc={doc} onJumpToMatch={onJumpToMatch} onSearchFor={onSearchFor} />
        ),
        toggleSidebarButton: (
            <Tooltip
                position={Position.BottomCenter}
                target={(
                    <Button onClick={toggleSidebar} isSelected={isSidebarOpened}>
                        <LeftSidebarIcon />
                    </Button>
                )}
                content={renderToggle}
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
    });
};

export default Toolbar;
