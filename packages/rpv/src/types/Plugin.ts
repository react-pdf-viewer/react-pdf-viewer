/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import PdfJs from '../vendors/PdfJs';
import { PluginFunctions } from './PluginFunctions';
import { RenderViewer } from './RenderViewer';
import { ViewerState } from './ViewerState';

interface PluginOnDocumentLoadProps {
    doc: PdfJs.PdfDocument;
}

interface PluginProps {
    install?(pluginFunctions: PluginFunctions): void;
    renderViewer?: RenderViewer;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onDocumentLoad?(props: PluginOnDocumentLoadProps): void;
    onViewerStateChange?(viewerState: ViewerState): ViewerState;
}

export type Plugin = PluginProps;
export type PluginOnDocumentLoad = PluginOnDocumentLoadProps;
