/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { PageMode } from '../structs/PageMode';

export declare namespace PdfJs {
    // Worker
    const GlobalWorkerOptions: GlobalWorker;
    interface GlobalWorker {
        workerSrc: string;
    }

    interface PDFWorkerConstructorParams {
        name: string;
    }
    interface PDFWorker {
        destroyed: boolean;
        destroy(): void;
    }
    interface PDFWorkerConstructor {
        new (params: PDFWorkerConstructorParams): PDFWorker;
    }

    // Loading task
    const PasswordResponses: PasswordResponsesValue;
    interface PasswordResponsesValue {
        NEED_PASSWORD: number;
        INCORRECT_PASSWORD: number;
    }

    type FileData = string | Uint8Array;

    interface LoadingTaskProgress {
        loaded: number;
        total: number;
    }

    interface LoadingTask {
        docId: string;
        onPassword: (verifyPassword: (password: string) => void, reason: number) => void;
        onProgress: (progress: LoadingTaskProgress) => void;
        promise: Promise<PdfDocument>;
        destroy(): void;
    }
    interface PdfDocument {
        loadingTask: LoadingTask;
        numPages: number;
        getAttachments(): Promise<{ [filename: string]: Attachment }>;
        getData(): Promise<Uint8Array>;
        getDestination(dest: string): Promise<OutlineDestination>;
        getDownloadInfo(): Promise<{ length: number }>;
        getMetadata(): Promise<MetaData>;
        getOutline(): Promise<Outline[]>;
        getPage(pageIndex: number): Promise<Page>;
        getPageIndex(ref: OutlineRef): Promise<number>;
        getPageLabels(): Promise<string[] | null>;
        getPageMode(): Promise<PageMode>;
        getPermissions(): Promise<number[] | null>;
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
    function getDocument(params: GetDocumentParams): LoadingTask;

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
        count?: undefined | number;
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
        convertToViewportPoint(x: number, y: number): [number, number];
    }

    // Render task
    interface PageRenderTask {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        promise: Promise<any>;
        cancel(): void;
    }

    // Render SVG
    interface SVGGraphics {
        getSVG(operatorList: PageOperatorList, viewport: ViewPort): Promise<SVGElement>;
    }
    interface SVGGraphicsConstructor {
        new (commonObjs: PageCommonObjects, objs: PageObjects): SVGGraphics;
    }
    let SVGGraphics: SVGGraphicsConstructor;

    // Render text layer
    interface RenderTextLayerParams {
        textContent?: PageTextContent;
        textContentSource: PageTextContent;
        container: HTMLDivElement;
        viewport: ViewPort;
    }
    interface PageTextContent {
        items: PageTextItem[];
    }
    interface PageTextItem {
        str: string;
    }
    function renderTextLayer(params: RenderTextLayerParams): PageRenderTask;

    // Annotations layer
    interface AnnotationsParams {
        // Can be 'display' or 'print'
        intent: string;
    }
    interface AnnotationPoint {
        x: number;
        y: number;
    }
    interface Annotation {
        annotationType: number;
        color?: Uint8ClampedArray;
        dest: OutlineDestinationType;
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
        contentsObj?: {
            dir: string;
            str: string;
        };
        modificationDate?: string;
        quadPoints?: AnnotationPoint[][];
        title?: string;
        titleObj?: {
            dir: string;
            str: string;
        };
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
        unsafeUrl?: string;
        url?: string;
        newWindow?: boolean;
        // Polyline annotation
        vertices?: AnnotationPoint[];
        // Text annotation
        name?: string;
    }
    const AnnotationLayer: PdfAnnotationLayer;
    interface RenderAnnotationLayerParams {
        annotations: Annotation[];
        div: HTMLDivElement | null;
        linkService: LinkService;
        page: Page;
        viewport: ViewPort;
    }
    interface PdfAnnotationLayer {
        render(params: RenderAnnotationLayerParams): void;
        update(params: RenderAnnotationLayerParams): void;
    }

    // Link service
    interface LinkService {
        externalLinkTarget?: number | null;
        getDestinationHash(dest: OutlineDestinationType): string;
        navigateTo(dest: OutlineDestinationType): void;
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
        getAnnotations(params: AnnotationsParams): Promise<Annotation[]>;
        getTextContent(): Promise<PageTextContent>;
        getViewport(params: ViewPortParams): ViewPort;
        render(params: PageRenderParams): PageRenderTask;
        getOperatorList(): Promise<PageOperatorList>;
        commonObjs: PageCommonObjects;
        objs: PageObjects;
        ref?: OutlineRef;
        view: number[];
    }

    /* eslint-disable @typescript-eslint/no-empty-interface */
    interface PageCommonObjects {}
    interface PageObjects {}
    interface PageOperatorList {}
    /* eslint-enable @typescript-eslint/no-empty-interface */
}
