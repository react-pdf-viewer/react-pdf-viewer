/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderGoToFirstPageProps {
    onClick: () => void;
}

export interface GoToFirstPageProps {
    children: RenderGoToFirstPage;
}

export type RenderGoToFirstPage = (props: RenderGoToFirstPageProps) => React.ReactElement;

export interface FirstPagePlugin extends Plugin {
    GoToFirstPage: (props: GoToFirstPageProps) => React.ReactElement;
    GoToFirstPageButton: () => React.ReactElement;
}

export default function firstPagePlugin(): FirstPagePlugin;
