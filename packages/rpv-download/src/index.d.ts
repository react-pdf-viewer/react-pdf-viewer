/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderDownloadProps {
    onClick(): void;
}

export interface DownloadProps {
    children?(props: RenderDownloadProps): ReactElement;
}

export interface FirstPagePlugin extends Plugin {
    Download(props: DownloadProps): ReactElement;
    DownloadButton(): ReactElement;
}

export default function firstPagePlugin(): FirstPagePlugin;

export class DownloadIcon extends Component<{}> {}
