/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export interface RenderShowSearchPopoverProps {
    onClick: () => void;
}

export interface RenderSearchProps {
    clearKeyword(): void;
    changeMatchCase(matchCase: boolean): void;
    changeWholeWords(wholeWords: boolean): void;
    currentMatch: number;
    jumpToNextMatch(): void;
    jumpToPreviousMatch(): void;
    keyword: string;
    matchCase: boolean;
    numberOfMatches: number;
    wholeWords: boolean;
    search(): void;
    setKeyword(keyword: string): void;
}

export interface ShowSearchPopoverProps {
    children?: (props: RenderShowSearchPopoverProps) => ReactElement;
}

export interface SearchProps {
    children?: (props: RenderSearchProps) => ReactElement;
}

export interface SearchPlugin extends Plugin {
    Search: (props: SearchProps) => ReactElement;
    ShowSearchPopover: (props: ShowSearchPopoverProps) => ReactElement;
    ShowSearchPopoverButton(): ReactElement;
}

export type SingleKeyword = string | RegExp;

export interface SearchPluginProps {
    // The keyword that will be highlighted in all pages
    keyword?: SingleKeyword | SingleKeyword[];
}

export function searchPlugin(props?: SearchPluginProps): SearchPlugin;

export class NextIcon extends Component {}
export class PreviousIcon extends Component {}
export class SearchIcon extends Component {}
