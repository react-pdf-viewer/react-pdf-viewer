/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import ViewerState from './ViewerState';

export interface PluginFunctions {
    setViewerState(viewerState: ViewerState): void;
    getViewerState(): ViewerState;
    jumpToPage(pageIndex: number): void;
}

interface Plugin {
    install?(pluginFunctions: PluginFunctions): void;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onViewerStateChange?(viewState: ViewerState): ViewerState;
}

export default Plugin;
