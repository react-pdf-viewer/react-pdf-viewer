/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '../types/PdfJs';

export const getContents = (annotation: PdfJs.Annotation): string => {
    // `contents` property is deprecated
    return annotation.contentsObj ? annotation.contentsObj.str : annotation.contents || '';
};
