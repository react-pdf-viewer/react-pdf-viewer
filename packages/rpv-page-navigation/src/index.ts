/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export { default as DownArrowIcon } from './DownArrowIcon';
export { default as NextIcon } from './NextIcon';
export { default as PreviousIcon } from './PreviousIcon';
import pageNavigationPlugin from './pageNavigationPlugin';
export { default as UpArrowIcon } from './UpArrowIcon';

export default pageNavigationPlugin;

// Types
export type { CurrentPageLabelProps } from './CurrentPageLabel';
export type { GoToFirstPageProps } from './GoToFirstPage';
export type { GoToFirstPageMenuItemProps } from './GoToFirstPageMenuItem';
export type { GoToLastPageProps } from './GoToLastPage';
export type { GoToLastPageMenuItemProps } from './GoToLastPageMenuItem';
export type { GoToNextPageProps } from './GoToNextPage';
export type { GoToPreviousPageProps } from './GoToPreviousPage';
