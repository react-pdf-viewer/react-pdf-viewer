/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import File from './File';
import SpecialZoomLevel from './SpecialZoomLevel';

interface ViewerState {
    // The current opened file. It can be changed from outside, such as user drags and drops an external file
    // or user opens a file from toolbar
    file: File;
    // The current page index
    pageIndex: number;
    // The current zoom level
    scale: number | SpecialZoomLevel;
}

export default ViewerState;
