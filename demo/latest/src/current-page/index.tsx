import Viewer, { Plugin, PluginFunctions, Worker, ViewerState } from '@phuocng/react-pdf-viewer';

const currentPagePlugin = (): Plugin => {
    return {
        install: (pluginFunctions: PluginFunctions) => {
            console.log('Install currentPagePlugin');
        },
        uninstall: (pluginFunctions: PluginFunctions) => {

        },
        onViewerStateChange: (state: ViewerState): ViewerState => {
            console.log('currentPagePlugin: page changed to', state.pageIndex);
            return state;
        },
    };
};

export default currentPagePlugin;
