/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

// ---------------
// PDFjs namespace
// ---------------

export declare namespace PdfJs {
    type FileData = string | Uint8Array;

    interface PdfDocument {
        numPages: number;
        getDownloadInfo(): Promise<{ length: number }>;
        getMetadata(): Promise<MetaData>;
        getPage(pageIndex: number): Promise<Page>;
    }

    // View port
    interface ViewPortParams {
        rotation?: number;
        scale: number;
    }
    interface ViewPortCloneParams {
        dontFlip: boolean;
    }
    interface ViewPort {
        height: number;
        rotation: number;
        transform: number[];
        width: number;
        clone(params: ViewPortCloneParams): ViewPort;
    }

    interface PageTextContent {
        items: PageTextItem[];
    }
    interface PageTextItem {
        str: string;
    }

    // Render task
    interface PageRenderTask {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        promise: Promise<any>;
        cancel(): void;
    }

    // Render page
    interface PageRenderParams {
        canvasContext: CanvasRenderingContext2D;
        // Should be 'print' when printing
        intent?: string;
        transform?: number[];
        viewport: ViewPort;
    }
    interface Page {
        getTextContent(): Promise<PageTextContent>;
        getViewport(params: ViewPortParams): ViewPort;
        render(params: PageRenderParams): PageRenderTask;
    }

    // Metadata
    interface MetaData {
        contentDispositionFilename?: string;
        info: MetaDataInfo;
    }
    interface MetaDataInfo {
        Author: string;
        CreationDate: string;
        Creator: string;
        Keywords: string;
        ModDate: string;
        PDFFormatVersion: string;
        Producer: string;
        Subject: string;
        Title: string;
    }
}

// --------------------
// Interfaces and types
// --------------------

export interface LocalizationMap {
    [key: string]: LocalizationMap;
}
export const LocalizationContext: React.Context<LocalizationMap>;

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
    attrs?: SlotAttr;
    children?: React.ReactNode;
    subSlot?: Slot;
}

export enum ToggleStatus {
    Close = 'Close',
    Open = 'Open',
    Toggle = 'Toggle',
}
export type Toggle = (status?: ToggleStatus) => void;

export interface ToolbarSlot {
    toggleSidebarButton: React.ReactNode;
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

// Menu
export class Menu extends React.Component<{}> {}

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
export interface RenderViewer {
    containerRef: React.RefObject<HTMLDivElement>;
    doc: PdfJs.PdfDocument;
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    slot: Slot;
    openFile(file: File): void;
    // Jump to given page
    // `page` is zero-index based
    jumpToPage(page: number): void;
    rotate(degree: number): void;
    zoom(level: number | SpecialZoomLevel): void;
}

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

// ------
// Events
// ------

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

// Invoked when users zoom the document
export interface ZoomEvent {
    doc: PdfJs.PdfDocument;
    scale: number;
}

// -------
// Plugins
// -------

export interface OpenFile {
    data: PdfJs.FileData;
    name: string;
}

export interface ViewerState {
    // The current opened file. It can be changed from outside, such as user drags and drops an external file
    // or user opens a file from toolbar
    file: OpenFile;
    // The current page index
    pageIndex: number;
    rotation: number;
    // The current zoom level
    scale: number;
}

export interface PluginFunctions {
    getPagesRef(): React.RefObject<HTMLDivElement>;
    getViewerState(): ViewerState;
    jumpToDestination(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
    jumpToPage(pageIndex: number): void;
    openFile(file: File): void;
    rotate(rotation: number): void;
    setViewerState(viewerState: ViewerState): void;
    zoom(scale: number | SpecialZoomLevel): void;
}

export interface PluginOnDocumentLoad {
    doc: PdfJs.PdfDocument;
}

export enum TextLayerRenderStatus {
    PreRender,
    DidRender,
}

export interface PluginOnTextLayerRender {
    ele: HTMLElement;
    pageIndex: number;
    scale: number;
    status: TextLayerRenderStatus;
}

export interface Plugin {
    install?(pluginFunctions: PluginFunctions): void;
    renderViewer?(props: RenderViewer): Slot;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onDocumentLoad?(props: PluginOnDocumentLoad): void;
    onTextLayerRender?(props: PluginOnTextLayerRender): void;
    onViewerStateChange?(viewerState: ViewerState): ViewerState;
}

// -----
// Store
// -----

export type StoreState = Record<string, any>;

export type StoreKey<T extends StoreState> = string & keyof T;
export type StoreHandler<T> = (params: T) => void;

export interface Store<T extends StoreState> {
    subscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandler<NonNullable<T[K]>>): void;
    unsubscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandler<NonNullable<T[K]>>): void;
    update<K extends StoreKey<T>>(eventName: K, params: T[K]): void;
    get<K extends StoreKey<T>>(eventName: K): T[K] | undefined;
}

export function createStore<T extends StoreState>(initialState?: T): Store<T>;

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
    // Plugins
    plugins?: Plugin[];
    localization?: LocalizationMap;
    // The prefix for CSS classes
    prefixClass?: string;
    renderError?: RenderError;
    renderPage?: RenderPage;
    onCanvasLayerRender?(e: CanvasLayerRenderEvent): void;
    onDocumentLoad?(e: DocumentLoadEvent): void;
    onPageChange?(e: PageChangeEvent): void;
    onZoom?(e: ZoomEvent): void;
}
export default class Viewer extends React.Component<ViewerProps> {}

// Worker
export interface WorkerProps {
    workerUrl: string;
}

export class Worker extends React.Component<WorkerProps> {}
