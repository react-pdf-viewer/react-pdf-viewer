/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderDownloadProps {
    onClick: () => void;
}

export type RenderDownload = (props: RenderDownloadProps) => React.ReactElement;

export interface DownloadProps {
    children?: RenderDownload;
}

export interface FirstPagePlugin extends Plugin {
    Download: (props: DownloadProps) => React.ReactElement;
    DownloadButton: () => React.ReactElement;
}

export default function firstPagePlugin(): FirstPagePlugin;

export class DownloadIcon extends React.Component<{}> {}
