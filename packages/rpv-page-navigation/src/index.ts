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
import { GoToFirstPageProps as GoToFirstPagePropsType } from './GoToFirstPage';
import { GoToLastPageProps as GoToLastPagePropsType } from './GoToLastPage';
import { GoToNextPageProps as GoToNextPagePropsType } from './GoToNextPage';
export type GoToFirstPageProps = GoToFirstPagePropsType;
export type GoToLastPageProps = GoToLastPagePropsType;
export type GoToNextPageProps = GoToNextPagePropsType;
