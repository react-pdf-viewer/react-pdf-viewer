/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Types
export type { CurrentPageLabelProps, RenderCurrentPageLabelProps } from './CurrentPageLabel';
export type { NumberOfPagesProps, RenderNumberOfPagesProps } from './NumberOfPages';
export type { GoToPageMenuItemProps, GoToPageProps, RenderGoToPage, RenderGoToPageProps } from './types';

// Plugin
export * from './pageNavigationPlugin';

// Components
export { DownArrowIcon } from './DownArrowIcon';
export { NextIcon } from './NextIcon';
export { PreviousIcon } from './PreviousIcon';
export { UpArrowIcon } from './UpArrowIcon';
