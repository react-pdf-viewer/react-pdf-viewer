/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from './vendors/PdfJs';

interface OpenFile {
    data: PdfJs.FileData;
    name: string;
};

export default OpenFile;
