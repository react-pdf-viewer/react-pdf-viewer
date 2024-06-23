/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from './PdfJs';

export interface PdfJsApiProvider {
    getDocument(params: PdfJs.GetDocumentParams): PdfJs.LoadingTask;

    // Worker
    PDFWorker: PdfJs.PDFWorkerConstructor;
    GlobalWorkerOptions: PdfJs.GlobalWorker;

    // Loading task
    PasswordResponses: PdfJs.PasswordResponsesValue;

    // Render SVG
    SVGGraphics: PdfJs.SVGGraphicsConstructor;

    // Render text layer
    TextLayer: PdfJs.TextLayer;
}
