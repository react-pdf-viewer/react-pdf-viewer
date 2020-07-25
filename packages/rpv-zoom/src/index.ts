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
import { CurrentScaleProps as CurrentScalePropsType } from './CurrentScale';
import { ZoomInProps as ZoomInPropsType } from './ZoomIn' ;
import { ZoomOutProps as ZoomOutPropsType } from './ZoomOut' ;

export type CurrentScaleProps = CurrentScalePropsType;
export type ZoomInProps = ZoomInPropsType;
export type ZoomOutProps = ZoomOutPropsType;
