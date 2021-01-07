/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@react-pdf-viewer/core';

// -------------------
// Render current page
// -------------------

export interface RenderCurrentPageLabelProps {
    currentPage: number;
    numberOfPages: number;
}

export interface CurrentPageLabelProps {
    children?: (props: RenderCurrentPageLabelProps) => React.ReactElement;
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

export interface GoToFirstPageProps {
    children?: (props: RenderGoToFirstPageProps) => React.ReactElement;
}

// -------------------------------------
// Render button to go the the last page
// -------------------------------------

export interface GoToLastPageMenuItemProps {
    onClick(): void;
}

export interface RenderGoToLastPageProps {
    onClick: () => void;
}

export interface GoToLastPageProps {
    children?: (props: RenderGoToLastPageProps) => React.ReactElement;
}

// ------------------------------------
// Render button to go to the next page
// ------------------------------------

export interface RenderGoToNextPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface GoToNextPageProps {
    children?: (props: RenderGoToNextPageProps) => React.ReactElement;
}

// ----------------------------------------
// Render button to go to the previous page
// ----------------------------------------

export interface RenderGoToPreviousPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

export interface GoToPreviousPageProps {
    children?: (props: RenderGoToPreviousPageProps) => React.ReactElement;
}

// ------
// Plugin
// ------

export interface PageNavigationPlugin extends Plugin {
    CurrentPageInput: () => React.ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => React.ReactElement;
    GoToFirstPage: (props: GoToFirstPageProps) => React.ReactElement;
    GoToFirstPageButton: () => React.ReactElement;
    GoToFirstPageMenuItem: () => React.ReactElement;
    GoToLastPage: (props: GoToLastPageProps) => React.ReactElement;
    GoToLastPageButton: () => React.ReactElement;
    GoToLastPageMenuItem: () => React.ReactElement;
    GoToNextPage: (props: GoToNextPageProps) => React.ReactElement;
    GoToNextPageButton: () => React.ReactElement;
    GoToPreviousPage: (props: GoToPreviousPageProps) => React.ReactElement;
    GoToPreviousPageButton: () => React.ReactElement;
}

export function pageNavigationPlugin(): PageNavigationPlugin;

// -----
// Icons
// -----

export class DownArrowIcon extends React.Component {}
export class NextIcon extends React.Component {}
export class PreviousIcon extends React.Component {}
export class UpArrowIcon extends React.Component {}
