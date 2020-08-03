/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export { default as NextIcon } from './NextIcon';
export { default as PreviousIcon } from './PreviousIcon';
export { default as SearchIcon } from './SearchIcon';
import searchPlugin from './searchPlugin';

export default searchPlugin;

// Types
export type { SearchPluginProps } from './searchPlugin';
export type { ShowSearchPopoverProps } from './ShowSearchPopover';
