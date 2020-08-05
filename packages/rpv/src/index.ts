/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export { default as Button } from './components/Button';
export { default as Menu } from './components/Menu';
export { default as MenuDivider } from './components/MenuDivider';
export { default as MenuItem } from './components/MenuItem';
export { default as PrimaryButton } from './components/PrimaryButton';
export { default as ProgressBar } from './components/ProgressBar';
export { default as Separator } from './components/Separator';
export { default as Spinner } from './components/Spinner';
export { default as Icon } from './icons/Icon';
export { default as defaultLayout } from './layouts/defaultLayout';
export { default as defaultToolbar } from './layouts/defaultToolbar';
export { default as Observer } from './layouts/Observer';
export { default as LocalizationContext } from './localization/LocalizationContext';
export { default as LocalizationProvider } from './localization/LocalizationProvider';
export { default as Modal } from './portal/Modal';
export { default as Popover } from './portal/Popover';
export { default as Position } from './portal/Position';
export { default as Tooltip } from './portal/Tooltip';
export { default as SpecialZoomLevel } from './SpecialZoomLevel';
export { default as createStore } from './store/createStore';
export { default as TextLayerRenderStatus } from './types/TextLayerRenderStatus';
import Viewer from './Viewer';
export { default as Worker } from './Worker';

export default Viewer;

// -----
// PdfJs
// -----

export declare namespace PdfJs {
    type FileData = string | Uint8Array;

    interface PdfDocument {
        numPages: number;
        getAttachments(): Promise<{[filename: string]: Attachment}>;
        getDestination(dest: string): Promise<OutlineDestination>;
        getDownloadInfo(): Promise<{ length: number }>;
        getOutline(): Promise<Outline[]>;
        getMetadata(): Promise<MetaData>;
        getPage(pageIndex: number): Promise<Page>;
        getPageIndex(ref: OutlineRef): Promise<number>;
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
        OutlineRef,
        OutlineDestinationName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...any[],
    ];
    interface OutlineDestinationName {
        name: string;   // Can be 'WYZ', 'Fit', ...
    }
    interface OutlineRef {
        gen: number;
        num: number;
    }
}

// -----
// Types
// -----


export type { Toggle } from './hooks/useToggle';
export type { default as LocalizationMap } from './localization/LocalizationMap';
export type { VisibilityChanged } from './layouts/Observer';
export type { default as Slot } from './layouts/Slot';
export type { default as OpenFile } from './OpenFile';
export type { default as Offset } from './portal/Offset';
export type { Store, StoreHandler } from './store/createStore';
export type { Plugin, PluginOnDocumentLoad, PluginOnTextLayerRender } from './types/Plugin';
export type { default as PluginFunctions } from './types/PluginFunctions';
export type { default as RenderViewer } from './types/RenderViewer';
export type { default as ViewerState } from './types/ViewerState';
