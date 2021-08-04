/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

// Types
export interface Offset {
    left: number;
    top: number;
}
export interface OpenFile {
    data: PdfJs.FileData;
    name: string;
}
export interface PageSize {
    pageHeight: number;
    pageWidth: number;
    scale: number;
}
export interface Plugin {
    install?(pluginFunctions: PluginFunctions): void;
    renderPageLayer?(props: PluginRenderPageLayer): React.ReactElement;
    renderViewer?(props: RenderViewer): Slot;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onAnnotationLayerRender?(props: PluginOnAnnotationLayerRender): void;
    onCanvasLayerRender?(props: PluginOnCanvasLayerRender): void;
    onDocumentLoad?(props: PluginOnDocumentLoad): void;
    onTextLayerRender?(props: PluginOnTextLayerRender): void;
    onViewerStateChange?(viewerState: ViewerState): ViewerState;
}
export interface PluginFunctions {
    getPageElement(pageIndex: number): HTMLElement | null;
    getPagesContainer(): HTMLElement;
    getViewerState(): ViewerState;
    jumpToDestination(
        pageIndex: number,
        bottomOffset: number,
        leftOffset: number,
        scaleTo: number | SpecialZoomLevel
    ): void;
    jumpToPage(pageIndex: number): void;
    openFile(file: File): void;
    rotate(rotation: number): void;
    setViewerState(viewerState: ViewerState): void;
    zoom(scale: number | SpecialZoomLevel): void;
}
export interface PluginOnDocumentLoad {
    doc: PdfJs.PdfDocument;
}
export interface PluginOnTextLayerRender {
    ele: HTMLElement;
    pageIndex: number;
    scale: number;
    status: LayerRenderStatus;
}
export interface PluginOnAnnotationLayerRender {
    annotations: PdfJs.Annotation[];
    container: HTMLElement;
    pageIndex: number;
    scale: number;
    rotation: number;
}
// Invoked when the canvas layer is rendered
export interface PluginOnCanvasLayerRender {
    ele: HTMLCanvasElement;
    pageIndex: number;
    rotation: number;
    scale: number;
    status: LayerRenderStatus;
}
export interface PluginRenderPageLayer {
    doc: PdfJs.PdfDocument;
    height: number;
    pageIndex: number;
    rotation: number;
    scale: number;
    width: number;
}
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
export interface Slot {
    attrs?: SlotAttr;
    children?: React.ReactNode;
    subSlot?: Slot;
}
export interface SlotAttr extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.MutableRefObject<HTMLDivElement | null>;
}
export type Toggle = (status?: ToggleStatus) => void;
export interface ViewerState {
    // The current opened file. It can be changed from outside, such as user drags and drops an external file
    // or user opens a file from toolbar
    file: OpenFile;
    // The current page index
    pageIndex: number;
    // Size of page
    pageHeight: number;
    pageWidth: number;
    rotation: number;
    // The current zoom level
    scale: number;
}
export interface VisibilityChanged {
    isVisible: boolean;
    ratio: number;
}

// Structs
export enum AnnotationType {
    Text = 1,
    Link = 2,
    FreeText = 3,
    Line = 4,
    Square = 5,
    Circle = 6,
    Polygon = 7,
    Polyline = 8,
    Highlight = 9,
    Underline = 10,
    Squiggly = 11,
    StrikeOut = 12,
    Stamp = 13,
    Caret = 14,
    Ink = 15,
    Popup = 16,
    FileAttachment = 17,
}

export enum LayerRenderStatus {
    PreRender,
    DidRender,
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

export enum SpecialZoomLevel {
    ActualSize = 'ActualSize',
    PageFit = 'PageFit',
    PageWidth = 'PageWidth',
}

export enum ToggleStatus {
    Close = 'Close',
    Open = 'Open',
    Toggle = 'Toggle',
}

// Components
export type RenderContent = (toggle: Toggle) => React.ReactNode;
export type RenderTarget = (toggle: Toggle, opened: boolean) => React.ReactNode;

export interface ButtonProps {
    onClick(): void;
}
export class Button extends React.Component<ButtonProps> {}

export class Menu extends React.Component {}

export class MenuDivider extends React.Component {}

export interface MenuItemProps {
    checked?: boolean;
    icon?: React.ReactElement;
    isDisabled?: boolean;
    onClick(): void;
}
export class MenuItem extends React.Component<MenuItemProps> {}

export interface MinimalButtonProps {
    ariaLabel?: string;
    ariaKeyShortcuts?: string;
    isDisabled?: boolean;
    isSelected?: boolean;
    onClick(): void;
}
export class MinimalButton extends React.Component<MinimalButtonProps> {}

export interface PrimaryButtonProps {
    onClick(): void;
}
export class PrimaryButton extends React.Component<PrimaryButtonProps> {}

export interface ProgressBarProps {
    progress: number;
}
export class ProgressBar extends React.Component<ProgressBarProps> {}

export class Separator extends React.Component {}

export interface SpinnerProps {
    size?: string;
}
export class Spinner extends React.Component<SpinnerProps> {}

export interface TextBoxProps {
    ariaLabel?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}
export class TextBox extends React.Component<TextBoxProps> {}

export interface IconProps {
    size?: number;
}
export class Icon extends React.Component<IconProps> {}

export interface ModalProps {
    ariaControlsSuffix?: string;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    target: RenderTarget;
}
export class Modal extends React.Component<ModalProps> {}

export interface PopoverProps {
    ariaControlsSuffix?: string;
    ariaHasPopup?: 'dialog' | 'menu';
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    content: RenderContent;
    offset: Offset;
    position: Position;
    target: RenderTarget;
}
export class Popover extends React.Component<PopoverProps> {}

export type RenderTooltipContent = () => React.ReactNode;
export interface TooltipProps {
    ariaControlsSuffix?: string;
    content: RenderTooltipContent;
    offset: Offset;
    position: Position;
    target: React.ReactElement;
}
export class Tooltip extends React.Component<TooltipProps> {}

// Store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Contexts
export interface LocalizationMap {
    [key: string]: LocalizationMap;
}
export interface LocalizationContextProps {
    l10n: LocalizationMap;
    setL10n(l10n: LocalizationMap): void;
}
export const LocalizationContext: React.Context<LocalizationContextProps>;

export interface ThemeContextProps {
    currentTheme: string;
    setCurrentTheme: (theme: string) => void;
}
export const ThemeContext: React.Context<ThemeContextProps>;
export interface ThemeProviderProps {
    theme?: string;
}
export class ThemeProvider extends React.Component<ThemeProviderProps> {}

// Viewer
// The character maps that can be downloaded from
// https://github.com/mozilla/pdfjs-dist/tree/master/cmaps
export interface CharacterMap {
    isCompressed: boolean;
    url: string;
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

export interface ViewerProps {
    characterMap?: CharacterMap;
    // The default zoom level
    // If it's not set, the initial zoom level will be calculated based on the dimesion of page and the container width
    // So that, the document will fit best within the container
    defaultScale?: number | SpecialZoomLevel;
    fileUrl: string | Uint8Array;
    // Additional authentication headers
    httpHeaders?: Record<string, string | string[]>;
    // The page (zero-index based) that will be displayed initially
    initialPage?: number;
    // Plugins
    plugins?: Plugin[];
    localization?: LocalizationMap;
    renderError?: RenderError;
    renderPage?: RenderPage;
    renderLoader?(percentages: number): React.ReactElement;
    // Theme
    theme?: string;
    transformGetDocumentParams?(options: PdfJs.GetDocumentParams): PdfJs.GetDocumentParams;
    // Indicate the cross-site requests should be made with credentials such as cookie and authorization headers.
    // The default value is `false`
    withCredentials?: boolean;
    onDocumentLoad?(e: DocumentLoadEvent): void;
    onPageChange?(e: PageChangeEvent): void;
    // Invoked after switching to `theme`
    onSwitchTheme?(theme: string): void;
    onZoom?(e: ZoomEvent): void;
}
export class Viewer extends React.Component<ViewerProps> {}

export interface WorkerProps {
    workerUrl: string;
}
export class Worker extends React.Component<WorkerProps> {}

// Hooks
export interface UseIntersectionObserverProps {
    threshold?: number | number[];
    onVisibilityChanged(params: VisibilityChanged): void;
}
export function useIntersectionObserver(props: UseIntersectionObserverProps): React.MutableRefObject<HTMLDivElement>;

export function useIsomorphicLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;

// Utils
export function classNames(classes: { [clazz: string]: boolean }): string;

export interface JumpToDestination {
    bottomOffset: number;
    pageIndex: number;
    scaleTo: number | SpecialZoomLevel;
}

export function getDestination(doc: PdfJs.PdfDocument, dest: PdfJs.OutlineDestinationType): Promise<JumpToDestination>;

export function isMac(): boolean;

// Vendors
// pdfjs namespace
export declare namespace PdfJs {
    type FileData = string | Uint8Array;

    // Worker
    interface PDFWorkerConstructorParams {
        name: string;
    }

    class PDFWorker {
        destroyed: boolean;
        constructor(params: PDFWorkerConstructorParams);
        destroy(): void;
    }

    // Document
    interface PdfDocument {
        numPages: number;
        getAttachments(): Promise<{ [filename: string]: Attachment }>;
        getDestination(dest: string): Promise<OutlineDestination>;
        getDownloadInfo(): Promise<{ length: number }>;
        getMetadata(): Promise<MetaData>;
        getOutline(): Promise<Outline[]>;
        getPage(pageIndex: number): Promise<Page>;
        getPageIndex(ref: OutlineRef): Promise<number>;
    }
    interface GetDocumentParams {
        data?: FileData;
        cMapUrl?: string;
        cMapPacked?: boolean;
        httpHeaders?: Record<string, string | string[]>;
        url?: string;
        withCredentials?: boolean;
        worker?: PDFWorker;
    }

    // Viewport
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

    // Attachment
    interface Attachment {
        content: Uint8Array;
        filename: string;
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

    // Outline
    type OutlineDestinationType = string | OutlineDestination;
    interface Outline {
        bold?: boolean;
        color?: number[];
        dest?: OutlineDestinationType;
        italic?: boolean;
        items: Outline[];
        newWindow?: boolean;
        title: string;
        unsafeUrl?: string;
        url?: string;
    }
    type OutlineDestination = [
        // The first item is used to indicate the destination page
        OutlineRef | number,
        OutlineDestinationName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...any[]
    ];
    interface OutlineDestinationName {
        name: string; // Can be 'WYZ', 'Fit', ...
    }
    interface OutlineRef {
        gen: number;
        num: number;
    }

    interface AnnotationPoint {
        x: number;
        y: number;
    }
    interface Annotation {
        annotationType: number;
        color?: Uint8ClampedArray;
        dest: string;
        hasAppearance: boolean;
        id: string;
        rect: number[];
        subtype: string;
        // Border style
        borderStyle: {
            dashArray: number[];
            horizontalCornerRadius: number;
            style: number;
            verticalCornerRadius: number;
            width: number;
        };
        // For annotation that has a popup
        hasPopup?: boolean;
        contents?: string;
        modificationDate?: string;
        quadPoints?: AnnotationPoint[][];
        title?: string;
        // Parent annotation
        parentId?: string;
        parentType?: string;
        // File attachment annotation
        file?: Attachment;
        // Ink annotation
        inkLists?: AnnotationPoint[][];
        // Line annotation
        lineCoordinates: number[];
        // Link annotation
        // `action` can be `FirstPage`, `PrevPage`, `NextPage`, `LastPage`, `GoBack`, `GoForward`
        action?: string;
        url?: string;
        newWindow?: boolean;
        // Polyline annotation
        vertices?: AnnotationPoint[];
        // Text annotation
        name?: string;
    }
}
