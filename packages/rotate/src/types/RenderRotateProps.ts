/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection } from '../structs/RotateDirection';

export interface RenderRotateProps {
    direction: RotateDirection;
    onClick(): void;
}
