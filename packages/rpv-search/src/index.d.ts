/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

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

export default function searchPlugin(): SearchPlugin;

export class SearchIcon extends Component<{}> {}
