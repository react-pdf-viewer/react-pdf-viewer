/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { ViewerState } from './ViewerState';

export interface PluginFunctionsProps {
    getPagesRef(): React.RefObject<HTMLDivElement>;
    getViewerState(): ViewerState;
    jumpToPage(pageIndex: number): void;
    setViewerState(viewerState: ViewerState): void;
}

export type PluginFunctions = PluginFunctionsProps;
