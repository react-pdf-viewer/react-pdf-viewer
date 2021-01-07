/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { PdfJs } from '@react-pdf-viewer/core';

export default interface PropertiesData {
    fileName: string;
    info: PdfJs.MetaDataInfo;
    length: number;
}
