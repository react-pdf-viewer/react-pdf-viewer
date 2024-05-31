/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

export { type ToolbarPluginProps, type ToolbarProps, type ToolbarSlot } from '@react-pdf-viewer/toolbar';
export { BookmarkIcon } from './BookmarkIcon';
export { FileIcon } from './FileIcon';
export { type SidebarTab } from './Sidebar';
export { ThumbnailIcon } from './ThumbnailIcon';
export * from './defaultLayoutPlugin';
export { setInitialTabFromPageMode } from './setInitialTabFromPageMode';
