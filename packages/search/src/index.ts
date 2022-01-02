/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Types
export type { FlagKeyword } from './types/FlagKeyword';
export type { Match } from './types/Match';
export type { MatchPosition } from './types/MatchPosition';
export type { OnHighlightKeyword } from './types/OnHighlightKeyword';
export type { RenderShowSearchPopoverProps } from './types/RenderShowSearchPopoverProps';
export type { SingleKeyword } from './types/SingleKeyword';
export type { RenderSearchProps, SearchProps } from './Search';
export type { ShowSearchPopoverProps } from './ShowSearchPopover';

// Plugin
export * from './searchPlugin';

// Components
export { NextIcon } from './NextIcon';
export { PreviousIcon } from './PreviousIcon';
export { SearchIcon } from './SearchIcon';
