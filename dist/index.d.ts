/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

// ---------------
// PDFjs namespace
// ---------------

export declare namespace PdfJs {
    interface PdfDocument {
        numPages: number;
    }
}

// --------------------
// Interfaces and types
// --------------------

export interface LocalizationMap {
    [key: string]: LocalizationMap;
}

export interface Offset {
    left: number;
    top: number;
}

export enum Position {
    TopLeft = 'TOP_LEFT',
    TopCenter = 'TOP_CENTER',
    TopRight = 'TOP_RIGHT',
    RightTop = 'RIGHT_TOP',
    RightCenter = 'RIGHT_CENTER',
    RightBottom = 'RIGHT_BOTTOM',
    BottomLeft = 'BOTTOM_LEFT',
    BottomCenter = 'BOTTOM_CENTER',
    BottomRight = 'BOTTOM_RIGHT',
    LeftTop = 'LEFT_TOP',
    LeftCenter = 'LEFT_CENTER',
    LeftBottom = 'LEFT_BOTTOM',
}

export type RenderToolbarSlot = (toolbarSlot: ToolbarSlot) => React.ReactElement;
export type RenderToolbar = (renderToolbar: RenderToolbarSlot) => React.ReactElement;

export function defaultToolbar(toolbarSlot: ToolbarSlot): RenderToolbarSlot;

export interface SlotAttr extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.MutableRefObject<HTMLDivElement | null>;
}
export interface Slot {
    attrs: SlotAttr;
    children: React.ReactNode;
}

export enum ToggleStatus {
    Close = 'Close',
    Open = 'Open',
    Toggle = 'Toggle',
}
export type Toggle = (status?: ToggleStatus) => void;

export interface ToolbarSlot {
    currentPage: number;
    numPages: number;
    toggleSidebarButton: React.ReactNode;
    searchPopover: React.ReactNode;
    previousPageButton: React.ReactNode;
    nextPageButton: React.ReactNode;
    currentPageInput: React.ReactNode;
    zoomOutButton: React.ReactNode;
    zoomPopover: React.ReactNode;
    zoomInButton: React.ReactNode;
    fullScreenButton: React.ReactNode;
    downloadButton: React.ReactNode;
    openFileButton: React.ReactNode;
    printButton: React.ReactNode;
    goToFirstPageButton: React.ReactNode;
    goToLastPageButton: React.ReactNode;
    rotateClockwiseButton: React.ReactNode;
    rotateCounterclockwiseButton: React.ReactNode;
    textSelectionButton: React.ReactNode;
    handToolButton: React.ReactNode;
    verticalScrollingButton: React.ReactNode;
    horizontalScrollingButton: React.ReactNode;
    wrappedScrollingButton: React.ReactNode;
    documentPropertiesButton: React.ReactNode;
    moreActionsPopover: React.ReactNode;
}

export enum ScrollMode {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
    Wrapped = 'Wrapped',
}

export enum SelectionMode {
    Hand,
    Text,
}

export enum SpecialZoomLevel {
    ActualSize = 'ActualSize',
    PageFit = 'PageFit',
    PageWidth = 'PageWidth',
}

// ----------
// Components
// ----------

// Button
export interface ButtonProps {
    isSelected?: boolean;
    onClick(): void;
}

export class Button extends React.Component<ButtonProps> {}

// Icon
export interface IconProps {
    size?: number;
}

export class Icon extends React.Component<IconProps> {}

// MenuDivider
export class MenuDivider extends React.Component<{}> {}

// MenuItem
export interface MenuItemProps {
    checked?: boolean;
    icon?: React.ReactElement;
    onClick(): void;
}

export class MenuItem extends React.Component<MenuItemProps> {}

// Modal
export interface ModalProps {
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    target: RenderTarget;
}

export class Modal extends React.Component<ModalProps> {}

// Popover
export interface PopoverProps {
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    offset: Offset;
    position: Position;
    target: RenderTarget;
}

export class Popover extends React.Component<PopoverProps> {}

// Portal
export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;

// Primary button
export interface PrimaryButtonProps {
    onClick(): void;
}

export class PrimaryButton extends React.Component<PrimaryButtonProps> {}

// Progress bar
export interface ProgressBarProps {
    progress: number;
}

export class ProgressBar extends React.Component<ProgressBarProps> {}

// Separator
export class Separator extends React.Component<{}> {}

// Spinner
export class Spinner extends React.Component<{}> {}

// Tooltip
export type RenderTooltipContent = () => React.ReactNode;

export interface TooltipProps {
    content: RenderTooltipContent;
    offset: Offset;
    position: Position;
    target: React.ReactElement;
}

export class Tooltip extends React.Component<TooltipProps> {}

// Viewer
export interface RenderViewerProps {
    viewer: React.ReactElement;
    doc: PdfJs.PdfDocument;
    download(): void;
    changeScrollMode(mode: ScrollMode): void;
    changeSelectionMode(mode: SelectionMode): void;
    // Jump to given page
    // `page` is zero-index based
    jumpToPage(page: number): void;
    print(): void;
    rotate(degree: number): void;
    zoom(level: number | SpecialZoomLevel): void;
}
export type RenderViewer = (props: RenderViewerProps) => React.ReactElement;

// Represents the error in case the document can't be loaded
export interface LoadError {
    message?: string;
    // Some possible values for `name` are
    // - AbortException
    // - FormatError
    // - InvalidPDFException
    // - MissingPDFException
    // - PasswordException
    // - UnexpectedResponseException
    // - UnknownErrorException
    name?: string;
}
export type RenderError = (error: LoadError) => React.ReactElement;

export interface RenderPageProps {
    annotationLayer: Slot;
    canvasLayer: Slot;
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
    svgLayer: Slot;
    textLayer: Slot;
    width: number;
}
export type RenderPage = (props: RenderPageProps) => React.ReactElement;

export type Layout = (
    isSidebarOpened: boolean,
    container: Slot,
    main: Slot,
    toolbar: RenderToolbar,
    sidebar: Slot,
) => React.ReactElement;

export function defaultLayout(
    isSidebarOpened: boolean,
    container: Slot,
    main: Slot,
    toolbar: React.ReactElement,
    sidebar: Slot,
): React.ReactElement;

// Events

// Invoked when the canvas layer is rendered completely
export interface CanvasLayerRenderEvent {
    ele: HTMLCanvasElement;
    pageIndex: number;
    rotation: number;
    scale: number;
}

// Invoked when the document is loaded successfully
export interface DocumentLoadEvent {
    doc: PdfJs.PdfDocument;
}

// Invoked when users change the current page
export interface PageChangeEvent {
    // zero-based page index
    currentPage: number;
    doc: PdfJs.PdfDocument;
}

// Invoked when the text layer is ready
export interface TextLayerRenderEvent {
    ele: HTMLElement;
}

// Invoked when users zoom the document
export interface ZoomEvent {
    doc: PdfJs.PdfDocument;
    scale: number;
}

// The character maps that can be downloaded from 
// https://github.com/mozilla/pdfjs-dist/tree/master/cmaps
export interface CharacterMap {
    isCompressed: boolean;
    url: string;
}

export interface ViewerProps {
    characterMap?: CharacterMap;
    // The default zoom level
    // If it's not set, the initial zoom level will be calculated based on the dimesion of page and the container width
    // So that, the document will fit best within the container
    defaultScale?: number | SpecialZoomLevel;
    fileUrl: string | Uint8Array;
    // The page (zero-index based) that will be displayed initially
    initialPage?: number;
    // The keyword that will be highlighted in all pages
    keyword?: string | RegExp;
    layout?: Layout;
    localization?: LocalizationMap;
    // The prefix for CSS classes
    prefixClass?: string;
    render?: RenderViewer;
    renderError?: RenderError;
    renderPage?: RenderPage;
    selectionMode?: SelectionMode;
    onCanvasLayerRender?(e: CanvasLayerRenderEvent): void;
    onDocumentLoad?(e: DocumentLoadEvent): void;
    onPageChange?(e: PageChangeEvent): void;
    onTextLayerRender?(e: TextLayerRenderEvent): void;
    onZoom?(e: ZoomEvent): void;
}
export default class Viewer extends React.Component<ViewerProps> {}

// Worker
export interface WorkerProps {
    workerUrl: string;
}

export class Worker extends React.Component<WorkerProps> {}
