/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from '../vendors/PdfJs';

interface FileItem {
    data: PdfJs.FileData;
    fileName: string;
}

export default FileItem;
