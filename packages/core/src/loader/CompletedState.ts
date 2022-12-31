/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs } from '../types/PdfJs';
import { LoadingStatus } from './LoadingStatus';

export class CompletedState extends LoadingStatus {
    public doc: PdfJs.PdfDocument;

    constructor(doc: PdfJs.PdfDocument) {
        super();
        this.doc = doc;
    }
}
