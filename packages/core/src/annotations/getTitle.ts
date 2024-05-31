/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type PdfJs } from '../types/PdfJs';

export const getTitle = (annotation: PdfJs.Annotation): string => {
    // `title` property is deprecated
    return annotation.titleObj ? annotation.titleObj.str : annotation.title || '';
};
