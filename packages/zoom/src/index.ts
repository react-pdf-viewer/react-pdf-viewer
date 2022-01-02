/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Types
export type { CurrentScaleProps, RenderCurrentScaleProps } from './CurrentScale';
export type { ZoomInProps } from './ZoomIn';
export type { ZoomOutProps } from './ZoomOut';
export type { ZoomProps } from './Zoom';
export type { RenderZoomInProps } from './types/RenderZoomInProps';
export type { RenderZoomOutProps } from './types/RenderZoomOutProps';
export type { RenderZoomProps } from './types/RenderZoomProps';
export type { ZoomMenuItemProps } from './types/ZoomMenuItemProps';

// Plugin
export * from './zoomPlugin';

// Components
export { ZoomInIcon } from './ZoomInIcon';
export { ZoomOutIcon } from './ZoomOutIcon';
