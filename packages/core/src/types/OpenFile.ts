/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '../types/PdfJs';

export interface OpenFile {
    data: PdfJs.FileData;
    name: string;
}
