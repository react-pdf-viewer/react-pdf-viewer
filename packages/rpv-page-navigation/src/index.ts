/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import DownArrowIcon from './DownArrowIcon';
import NextIcon from './NextIcon';
import PreviousIcon from './PreviousIcon';
import pageNavigationPlugin from './pageNavigationPlugin';
import UpArrowIcon from './UpArrowIcon';

export default pageNavigationPlugin;
export { DownArrowIcon, NextIcon, PreviousIcon, UpArrowIcon };

// Types
import { CurrentPageLabelProps as CurrentPageLabelPropsType } from './CurrentPageLabel';
import { GoToFirstPageProps as GoToFirstPagePropsType } from './GoToFirstPage';
import { GoToFirstPageMenuItemProps as GoToFirstPageMenuItemPropsType } from './GoToFirstPageMenuItem';
import { GoToLastPageProps as GoToLastPagePropsType } from './GoToLastPage';
import { GoToLastPageMenuItemProps as GoToLastPageMenuItemPropsType } from './GoToLastPageMenuItem';
import { GoToNextPageProps as GoToNextPagePropsType } from './GoToNextPage';
import { GoToPreviousPageProps as GoToPreviousPagePropsType } from './GoToPreviousPage';

export type CurrentPageLabelProps = CurrentPageLabelPropsType;
export type GoToFirstPageProps = GoToFirstPagePropsType;
export type GoToFirstPageMenuItemProps = GoToFirstPageMenuItemPropsType;
export type GoToLastPageProps = GoToLastPagePropsType;
export type GoToLastPageMenuItemProps = GoToLastPageMenuItemPropsType;
export type GoToNextPageProps = GoToNextPagePropsType;
export type GoToPreviousPageProps = GoToPreviousPagePropsType;
