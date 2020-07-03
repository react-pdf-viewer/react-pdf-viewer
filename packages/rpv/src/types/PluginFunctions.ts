/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { ViewerState } from './ViewerState';

export interface PluginFunctionsProps {
    setViewerState(viewerState: ViewerState): void;
    getViewerState(): ViewerState;
    jumpToPage(pageIndex: number): void;
}

export type PluginFunctions = PluginFunctionsProps;
