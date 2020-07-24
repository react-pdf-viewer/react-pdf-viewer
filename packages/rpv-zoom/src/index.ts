/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import zoomPlugin from './zoomPlugin';
import ZoomInIcon from './ZoomInIcon';
import ZoomOutIcon from './ZoomOutIcon';

export default zoomPlugin;
export { ZoomInIcon, ZoomOutIcon };

// Types
import { ZoomOutProps as ZoomOutPropsType } from './ZoomOut' ;
export type ZoomOutProps = ZoomOutPropsType;
