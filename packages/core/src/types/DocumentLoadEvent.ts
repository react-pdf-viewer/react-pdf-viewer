/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type OpenFile } from './OpenFile';
import { type PdfJs } from './PdfJs';

export interface DocumentLoadEvent {
    doc: PdfJs.PdfDocument;
    file: OpenFile;
}
