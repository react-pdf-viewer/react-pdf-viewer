/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import ExitFullScreenIcon from './ExitFullScreenIcon';
import fullScreenPlugin from './fullScreenPlugin';
import FullScreenIcon from './FullScreenIcon';

export default fullScreenPlugin;
export { ExitFullScreenIcon, FullScreenIcon };

// Types
import { EnterFullScreenProps as EnterFullScreenPropsType } from './EnterFullScreen';
export type EnterFullScreenProps = EnterFullScreenPropsType;
