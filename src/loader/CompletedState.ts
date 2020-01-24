/**
 * A React component to view a PDF document
 * 
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from '../PdfJs';
import LoadingStatus from './LoadingStatus';

class CompletedState extends LoadingStatus {
    public doc: PdfJs.PdfDocument;

    constructor(doc: PdfJs.PdfDocument) {
        super();
        this.doc = doc;
    }
}

export default CompletedState;
