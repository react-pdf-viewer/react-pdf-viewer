/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import rotatePlugin from './rotatePlugin';
export { default as RotateBackwardIcon } from './RotateBackwardIcon';
export { default as  RotateForwardIcon } from './RotateForwardIcon';
export { default as RotateDirection } from './RotateDirection';

export default rotatePlugin;

// Types
export type { RotateDecoratorProps } from './rotatePlugin';
export type { RotateProps } from './Rotate';
