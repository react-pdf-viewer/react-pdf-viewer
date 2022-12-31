/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type {
    Plugin,
    PluginFunctions,
    PluginOnAnnotationLayerRender,
    PluginOnDocumentLoad,
    PluginOnTextLayerRender,
    PluginRenderPageLayer,
    RenderViewer,
    ViewerState,
} from '@react-pdf-viewer/core';
import type { FullScreenPlugin, FullScreenPluginProps } from '@react-pdf-viewer/full-screen';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import type { GetFilePlugin, GetFilePluginProps } from '@react-pdf-viewer/get-file';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import type { OpenPlugin, OpenPluginProps } from '@react-pdf-viewer/open';
import { openPlugin } from '@react-pdf-viewer/open';
import type { PageNavigationPlugin, PageNavigationPluginProps } from '@react-pdf-viewer/page-navigation';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import type { PrintPlugin, PrintPluginProps } from '@react-pdf-viewer/print';
import { printPlugin } from '@react-pdf-viewer/print';
import type { PropertiesPlugin } from '@react-pdf-viewer/properties';
import { propertiesPlugin } from '@react-pdf-viewer/properties';
import type { RotatePlugin } from '@react-pdf-viewer/rotate';
import { rotatePlugin } from '@react-pdf-viewer/rotate';
import type { ScrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import type { SearchPlugin, SearchPluginProps } from '@react-pdf-viewer/search';
import { searchPlugin } from '@react-pdf-viewer/search';
import type { SelectionModePlugin, SelectionModePluginProps } from '@react-pdf-viewer/selection-mode';
import { selectionModePlugin } from '@react-pdf-viewer/selection-mode';
import type { ThemePlugin } from '@react-pdf-viewer/theme';
import { themePlugin } from '@react-pdf-viewer/theme';
import type { ZoomPlugin, ZoomPluginProps } from '@react-pdf-viewer/zoom';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import * as React from 'react';
import { renderDefaultToolbar } from './renderDefaultToolbar';
import { Toolbar, ToolbarProps } from './Toolbar';
import type { ToolbarSlot } from './types/ToolbarSlot';
import type { TransformToolbarSlot } from './types/TransformToolbarSlot';

export interface ToolbarPlugin extends Plugin {
    renderDefaultToolbar: (
        transformToolbarSlot: TransformToolbarSlot
    ) => (defaultToolbarSlot: ToolbarSlot) => React.ReactElement;
    Toolbar: (props: ToolbarProps) => React.ReactElement;
    // Plugins instance
    readonly fullScreenPluginInstance: FullScreenPlugin;
    readonly getFilePluginInstance: GetFilePlugin;
    readonly openPluginInstance: OpenPlugin;
    readonly pageNavigationPluginInstance: PageNavigationPlugin;
    readonly printPluginInstance: PrintPlugin;
    readonly propertiesPluginInstance: PropertiesPlugin;
    readonly rotatePluginInstance: RotatePlugin;
    readonly scrollModePluginInstance: ScrollModePlugin;
    readonly searchPluginInstance: SearchPlugin;
    readonly selectionModePluginInstance: SelectionModePlugin;
    readonly themePluginInstance: ThemePlugin;
    readonly zoomPluginInstance: ZoomPlugin;
}

export interface ToolbarPluginProps {
    fullScreenPlugin?: FullScreenPluginProps;
    getFilePlugin?: GetFilePluginProps;
    openPlugin?: OpenPluginProps;
    pageNavigationPlugin?: PageNavigationPluginProps;
    printPlugin?: PrintPluginProps;
    searchPlugin?: SearchPluginProps;
    selectionModePlugin?: SelectionModePluginProps;
    zoomPlugin?: ZoomPluginProps;
}

export const toolbarPlugin = (props?: ToolbarPluginProps): ToolbarPlugin => {
    const fullScreenPluginInstance = fullScreenPlugin(props ? props.fullScreenPlugin : {});
    const getFilePluginInstance = getFilePlugin(props ? props.getFilePlugin : {});
    const openPluginInstance = openPlugin(props ? props.openPlugin : {});
    const pageNavigationPluginInstance = pageNavigationPlugin(props ? props.pageNavigationPlugin : {});
    const printPluginInstance = printPlugin(props ? props.printPlugin : {});
    const propertiesPluginInstance = propertiesPlugin();
    const rotatePluginInstance = rotatePlugin();
    const scrollModePluginInstance = scrollModePlugin();
    const searchPluginInstance = searchPlugin(props ? props.searchPlugin : {});
    const selectionModePluginInstance = selectionModePlugin(props ? props.selectionModePlugin : {});
    const themePluginInstance = themePlugin();
    const zoomPluginInstance = zoomPlugin(props ? props.zoomPlugin : {});

    const plugins = [
        fullScreenPluginInstance,
        getFilePluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        propertiesPluginInstance,
        rotatePluginInstance,
        scrollModePluginInstance,
        searchPluginInstance,
        selectionModePluginInstance,
        themePluginInstance,
        zoomPluginInstance,
    ];

    const ToolbarDecorator = React.useCallback((props: ToolbarProps) => {
        const { EnterFullScreen, EnterFullScreenMenuItem } = fullScreenPluginInstance;
        const { Download, DownloadMenuItem } = getFilePluginInstance;
        const { Open, OpenMenuItem } = openPluginInstance;
        const {
            CurrentPageInput,
            CurrentPageLabel,
            GoToFirstPage,
            GoToFirstPageMenuItem,
            GoToLastPage,
            GoToLastPageMenuItem,
            GoToNextPage,
            GoToNextPageMenuItem,
            GoToPreviousPage,
            GoToPreviousPageMenuItem,
            NumberOfPages,
        } = pageNavigationPluginInstance;
        const { Print, PrintMenuItem } = printPluginInstance;
        const { ShowProperties, ShowPropertiesMenuItem } = propertiesPluginInstance;
        const { Rotate, RotateBackwardMenuItem, RotateForwardMenuItem } = rotatePluginInstance;
        const { SwitchScrollMode, SwitchScrollModeMenuItem, SwitchViewMode, SwitchViewModeMenuItem } =
            scrollModePluginInstance;
        const { Search, ShowSearchPopover } = searchPluginInstance;
        const { SwitchSelectionMode, SwitchSelectionModeMenuItem } = selectionModePluginInstance;
        const { SwitchTheme, SwitchThemeMenuItem } = themePluginInstance;
        const { CurrentScale, Zoom, ZoomIn, ZoomInMenuItem, ZoomOut, ZoomOutMenuItem } = zoomPluginInstance;

        return (
            <Toolbar
                {...props}
                slot={{
                    CurrentPageInput,
                    CurrentPageLabel,
                    CurrentScale,
                    Download,
                    DownloadMenuItem,
                    EnterFullScreen,
                    EnterFullScreenMenuItem,
                    GoToFirstPage,
                    GoToFirstPageMenuItem,
                    GoToLastPage,
                    GoToLastPageMenuItem,
                    GoToNextPage,
                    GoToNextPageMenuItem,
                    GoToPreviousPage,
                    GoToPreviousPageMenuItem,
                    NumberOfPages,
                    Open,
                    OpenMenuItem,
                    Print,
                    PrintMenuItem,
                    Rotate,
                    RotateBackwardMenuItem,
                    RotateForwardMenuItem,
                    Search,
                    ShowProperties,
                    ShowPropertiesMenuItem,
                    ShowSearchPopover,
                    SwitchScrollMode,
                    SwitchScrollModeMenuItem,
                    SwitchSelectionMode,
                    SwitchSelectionModeMenuItem,
                    SwitchViewMode,
                    SwitchViewModeMenuItem,
                    SwitchTheme,
                    SwitchThemeMenuItem,
                    Zoom,
                    ZoomIn,
                    ZoomInMenuItem,
                    ZoomOut,
                    ZoomOutMenuItem,
                }}
            />
        );
    }, []);

    return {
        // Plugin instances
        fullScreenPluginInstance,
        getFilePluginInstance,
        openPluginInstance,
        pageNavigationPluginInstance,
        printPluginInstance,
        propertiesPluginInstance,
        rotatePluginInstance,
        scrollModePluginInstance,
        searchPluginInstance,
        selectionModePluginInstance,
        themePluginInstance,
        zoomPluginInstance,
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach((plugin) => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderPageLayer: (renderProps: PluginRenderPageLayer) => (
            <React.Fragment>
                {plugins.map((plugin, idx) =>
                    plugin.renderPageLayer ? (
                        <React.Fragment key={idx}>{plugin.renderPageLayer(renderProps)}</React.Fragment>
                    ) : (
                        <React.Fragment key={idx}></React.Fragment>
                    )
                )}
            </React.Fragment>
        ),
        renderViewer: (props: RenderViewer) => {
            let { slot } = props;
            plugins.forEach((plugin) => {
                if (plugin.renderViewer) {
                    slot = plugin.renderViewer({ ...props, slot });
                }
            });
            return slot;
        },
        uninstall: (pluginFunctions: PluginFunctions) => {
            // Unistall plugins
            plugins.forEach((plugin) => {
                if (plugin.uninstall) {
                    plugin.uninstall(pluginFunctions);
                }
            });
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            plugins.forEach((plugin) => {
                if (plugin.onDocumentLoad) {
                    plugin.onDocumentLoad(props);
                }
            });
        },
        onAnnotationLayerRender: (props: PluginOnAnnotationLayerRender) => {
            plugins.forEach((plugin) => {
                if (plugin.onAnnotationLayerRender) {
                    plugin.onAnnotationLayerRender(props);
                }
            });
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            plugins.forEach((plugin) => {
                if (plugin.onTextLayerRender) {
                    plugin.onTextLayerRender(props);
                }
            });
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            let newState = viewerState;
            plugins.forEach((plugin) => {
                if (plugin.onViewerStateChange) {
                    newState = plugin.onViewerStateChange(newState);
                }
            });
            return newState;
        },
        renderDefaultToolbar,
        Toolbar: ToolbarDecorator,
    };
};
