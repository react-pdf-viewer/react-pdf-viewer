/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderGoToLastPageProps {
    onClick: () => void;
}

export interface GoToLastPageProps {
    children: RenderGoToLastPage;
}

export type RenderGoToLastPage = (props: RenderGoToLastPageProps) => React.ReactElement;

export interface LastPagePlugin extends Plugin {
    GoToLastPage: (props: GoToLastPageProps) => React.ReactElement;
    GoToLastPageButton: () => React.ReactElement;
}

export default function lastPagePlugin(): LastPagePlugin;

export class DownArrowIcon extends React.Component<{}> {}
