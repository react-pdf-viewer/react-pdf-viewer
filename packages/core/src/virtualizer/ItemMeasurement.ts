/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Offset } from '../types/Offset';
import { type Rect } from '../types/Rect';

export interface ItemMeasurement {
    index: number;
    start: Offset;
    size: Rect;
    end: Offset;
    visibility: number;
}
