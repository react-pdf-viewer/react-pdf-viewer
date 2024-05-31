/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
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
    renderTextLayer(params: PdfJs.RenderTextLayerParams): PdfJs.PageRenderTask;
}
