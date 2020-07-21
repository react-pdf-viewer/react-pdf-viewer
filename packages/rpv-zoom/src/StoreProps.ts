/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { SpecialZoomLevel } from '@phuocng/rpv';

interface StoreProps {
    scale?: number;
    zoom?(scale: number | SpecialZoomLevel): void;
}

export default StoreProps;
