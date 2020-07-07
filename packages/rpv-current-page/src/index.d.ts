/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderCurrentPageLabelProps {
    currentPage: number;
    numberOfPages: number;
}

export interface CurrentPageLabelProps {
    children?: RenderCurrentPageLabel;
}

export type RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => React.ReactElement;

export interface CurrentPagePlugin extends Plugin {
    CurrentPageInput: () => React.ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => React.ReactElement;
}

export default function currentPagePlugin(): CurrentPagePlugin;
