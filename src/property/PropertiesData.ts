/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from '../PdfJs';

interface PropertiesData {
    fileName: string;
    info: PdfJs.MetaDataInfo;
    length: number;
}

export default PropertiesData;
