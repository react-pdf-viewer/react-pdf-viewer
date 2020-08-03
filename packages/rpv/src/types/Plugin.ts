/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import Slot from '../layouts/Slot';
import PdfJs from '../vendors/PdfJs';
import PluginFunctions from './PluginFunctions';
import RenderViewer from './RenderViewer';
import TextLayerRenderStatus from './TextLayerRenderStatus';
import ViewerState from './ViewerState';

export interface PluginOnDocumentLoad {
    doc: PdfJs.PdfDocument;
}

export interface PluginOnTextLayerRender {
    ele: HTMLElement;
    pageIndex: number;
    scale: number;
    status: TextLayerRenderStatus;
}

export interface Plugin {
    install?(pluginFunctions: PluginFunctions): void;
    renderViewer?(props: RenderViewer): Slot;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onDocumentLoad?(props: PluginOnDocumentLoad): void;
    onTextLayerRender?(props: PluginOnTextLayerRender): void;
    onViewerStateChange?(viewerState: ViewerState): ViewerState;
}
