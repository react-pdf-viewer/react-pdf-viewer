/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import scrollModePlugin from './scrollModePlugin';
import './styles';

export { default as HorizontalScrollingIcon } from './HorizontalScrollingIcon';
export { default as ScrollMode } from './ScrollMode';
export { default as VerticalScrollingIcon } from './VerticalScrollingIcon';
export { default as WrappedScrollingIcon } from './WrappedScrollingIcon';

export default scrollModePlugin;
