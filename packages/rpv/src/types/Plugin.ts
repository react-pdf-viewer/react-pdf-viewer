/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { PluginFunctions } from './PluginFunctions';
import { ViewerState } from './ViewerState';

interface PluginProps {
    install?(pluginFunctions: PluginFunctions): void;
    uninstall?(pluginFunctions: PluginFunctions): void;
    onViewerStateChange?(viewState: ViewerState): ViewerState;
}

export type Plugin = PluginProps;
