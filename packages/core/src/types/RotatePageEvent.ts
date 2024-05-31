/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection } from '../structs/RotateDirection';
import { type PdfJs } from './PdfJs';

export interface RotatePageEvent {
    direction: RotateDirection;
    doc: PdfJs.PdfDocument;
    pageIndex: number;
    rotation: number;
}
