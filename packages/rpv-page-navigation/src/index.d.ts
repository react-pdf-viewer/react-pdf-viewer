/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

// -------------------
// Render current page
// -------------------

export interface RenderCurrentPageLabelProps {
    currentPage: number;
    numberOfPages: number;
}

export type RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => ReactElement;

export interface CurrentPageLabelProps {
    children?: RenderCurrentPageLabel;
}

// -------------------------------------
// Render button to go to the first page
// -------------------------------------

export interface GoToFirstPageMenuItemProps {
    onClick: () => void;
}

export interface RenderGoToFirstPageProps {
    onClick: () => void;
}

export type RenderGoToFirstPage = (props: RenderGoToFirstPageProps) => ReactElement;

export interface GoToFirstPageProps {
    children?: RenderGoToFirstPage;
}

// -------------------------------------
// Render button to go the the last page
// -------------------------------------

export interface RenderGoToLastPageProps {
    onClick: () => void;
}

export type RenderGoToLastPage = (props: RenderGoToLastPageProps) => ReactElement;

export interface GoToLastPageProps {
    children?: RenderGoToLastPage;
}

// ------------------------------------
// Render button to go to the next page
// ------------------------------------

export interface RenderGoToNextPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

export type RenderGoToNextPage = (props: RenderGoToNextPageProps) => ReactElement;

export interface GoToNextPageProps {
    children?: RenderGoToNextPage;
}

// ----------------------------------------
// Render button to go to the previous page
// ----------------------------------------

export interface RenderGoToPreviousPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

export type RenderGoToPreviousPage = (props: RenderGoToPreviousPageProps) => ReactElement;

export interface GoToPreviousPageProps {
    children?: RenderGoToPreviousPage;
}

// ------
// Plugin
// ------

export interface PageNavigationPlugin extends Plugin {
    CurrentPageInput: () => ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => ReactElement;
    GoToFirstPage: (props: GoToFirstPageProps) => ReactElement;
    GoToFirstPageButton: () => ReactElement;
    GoToFirstPageMenuItem: () => ReactElement;
    GoToLastPage: (props: GoToLastPageProps) => ReactElement;
    GoToLastPageButton: () => ReactElement;
    GoToLastPageMenuItem: () => ReactElement;
    GoToNextPage: (props: GoToNextPageProps) => ReactElement;
    GoToNextPageButton: () => ReactElement;
    GoToPreviousPage: (props: GoToPreviousPageProps) => ReactElement;
    GoToPreviousPageButton: () => ReactElement;
}

export default function pageNavigationPlugin(): PageNavigationPlugin;

// -----
// Icons
// -----

export class DownArrowIcon extends Component<{}> {}
export class NextIcon extends Component<{}> {}
export class PreviousIcon extends Component<{}> {}
export class UpArrowIcon extends Component<{}> {}
