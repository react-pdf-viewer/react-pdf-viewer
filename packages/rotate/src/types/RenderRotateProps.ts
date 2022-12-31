/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection } from '@react-pdf-viewer/core';

export interface RenderRotateProps {
    direction: RotateDirection;
    onClick(): void;
}
