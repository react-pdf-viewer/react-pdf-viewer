/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export { default as BookmarkIcon } from './BookmarkIcon';
import defaultLayoutPlugin from './defaultLayoutPlugin';
export { default as FileIcon } from './FileIcon';
export { default as ThumbnailIcon } from './ThumbnailIcon';

export default defaultLayoutPlugin;

// Types
export type { DefaultLayoutPluginProps } from './defaultLayoutPlugin';
