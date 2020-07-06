/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Plugin } from '@phuocng/rpv';

export interface RenderPreviousPageButtonProps {
    isDisabled: boolean;
    onClick: () => void;
}

export type RenderPreviousPageButton = (props: RenderPreviousPageButtonProps) => React.ReactElement;

export interface PreviousPageButtonProps {
    children?: RenderPreviousPageButton;
}

export interface PreviousPagePlugin extends Plugin {
    PreviousPageButton: (props: PreviousPageButtonProps) => React.ReactElement;
}

export default function previousPagePlugin(): PreviousPagePlugin;
