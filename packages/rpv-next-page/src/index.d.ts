/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderNextPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export type RenderNextPageButton = (props: RenderNextPageButtonProps) => React.ReactElement;

export interface NextPageButtonProps {
    children?: RenderNextPageButton;
}

export interface NextPagePlugin extends Plugin {
    NextPageButton: (props: NextPageButtonProps) => React.ReactElement;
}

export default function nextPagePlugin(): NextPagePlugin;
