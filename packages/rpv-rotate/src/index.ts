/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import rotatePlugin, { RotateDecoratorProps as RotateDecoratorPropsType } from './rotatePlugin';
import RotateBackwardIcon from './RotateBackwardIcon';
import RotateForwardIcon from './RotateForwardIcon';
import RotateDirection from './RotateDirection';

export default rotatePlugin;

export {
    RotateBackwardIcon,
    RotateDirection,
    RotateForwardIcon,
};

// Types
import { RotateProps as RotatePropsType } from './Rotate';
export type RotateDecoratorProps = RotateDecoratorPropsType;
export type RotateProps = RotatePropsType;
