/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Types
export type { ToolbarPluginProps, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/toolbar';
export type { SidebarTab } from './Sidebar';

// Plugin
export * from './defaultLayoutPlugin';

// Components
export { BookmarkIcon } from './BookmarkIcon';
export { FileIcon } from './FileIcon';
export { ThumbnailIcon } from './ThumbnailIcon';
