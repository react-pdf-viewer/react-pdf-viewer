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
    icon: ReactElement;
    label: string;
    onClick: () => void;
}

export interface ShowSearchPopoverProps {
    children?: (props: RenderShowSearchPopoverProps) => ReactElement;
}

export interface SearchPlugin extends Plugin {
    ShowSearchPopover: (props: ShowSearchPopoverProps) => ReactElement;
}

export interface SearchPluginProps {
    // The keyword that will be highlighted in all pages
    keyword?: string | RegExp;
}

export default function searchPlugin(props?: SearchPluginProps): SearchPlugin;

export class NextIcon extends Component {}
export class PreviousIcon extends Component {}
export class SearchIcon extends Component {}
