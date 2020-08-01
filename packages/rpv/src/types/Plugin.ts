/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from '../vendors/PdfJs';
import PluginFunctions from './PluginFunctions';
import RenderViewer from './RenderViewer';
import Slot from '../layouts/Slot';
import ViewerState from './ViewerState';

export interface PluginOnDocumentLoad {
    doc: PdfJs.PdfDocument;
}

export interface Plugin {
    install?(pluginFunctions: PluginFunctions): void;
    renderViewer?(props: RenderViewer): Slot;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onDocumentLoad?(props: PluginOnDocumentLoad): void;
    onViewerStateChange?(viewerState: ViewerState): ViewerState;
}
