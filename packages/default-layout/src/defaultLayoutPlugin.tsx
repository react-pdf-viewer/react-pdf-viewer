/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { attachmentPlugin, AttachmentPlugin } from '@react-pdf-viewer/attachment';
import { bookmarkPlugin, BookmarkPlugin } from '@react-pdf-viewer/bookmark';
import {
    createStore,
    Plugin,
    PluginFunctions,
    PluginOnDocumentLoad,
    RenderViewer,
    ViewerState,
    PluginOnAnnotationLayerRender,
    PluginOnTextLayerRender,
} from '@react-pdf-viewer/core';
import { thumbnailPlugin, ThumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { toolbarPlugin, ToolbarPlugin, ToolbarPluginProps, ToolbarProps } from '@react-pdf-viewer/toolbar';

import Sidebar, { SidebarTab } from './Sidebar';
import StoreProps from './StoreProps';

export interface DefaultLayoutPlugin extends Plugin {
    activateTab(index: number): void;
    attachmentPluginInstance: AttachmentPlugin;
    bookmarkPluginInstance: BookmarkPlugin;
    thumbnailPluginInstance: ThumbnailPlugin;
    toolbarPluginInstance: ToolbarPlugin;
}

export interface DefaultLayoutPluginProps {
    toolbarPlugin?: ToolbarPluginProps;
    renderToolbar?: (Toolbar: (props: ToolbarProps) => React.ReactElement) => React.ReactElement;
    sidebarTabs?: (defaultTabs: SidebarTab[]) => SidebarTab[];
}

const defaultLayoutPlugin = (props?: DefaultLayoutPluginProps): DefaultLayoutPlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                currentTab: 0,
            }),
        []
    );

    const attachmentPluginInstance = attachmentPlugin();
    const bookmarkPluginInstance = bookmarkPlugin();
    const thumbnailPluginInstance = thumbnailPlugin();
    const toolbarPluginInstance = toolbarPlugin(props ? props.toolbarPlugin : {});

    const { Attachments } = attachmentPluginInstance;
    const { Bookmarks } = bookmarkPluginInstance;
    const { Thumbnails } = thumbnailPluginInstance;
    const { Toolbar } = toolbarPluginInstance;

    const sidebarTabs = props ? props.sidebarTabs : (defaultTabs: SidebarTab[]) => defaultTabs;

    const plugins = [attachmentPluginInstance, bookmarkPluginInstance, thumbnailPluginInstance, toolbarPluginInstance];

    return {
        // The plugin instances
        attachmentPluginInstance,
        bookmarkPluginInstance,
        thumbnailPluginInstance,
        toolbarPluginInstance,
        activateTab: (index: number) => {
            store.update('currentTab', index);
        },
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach((plugin) => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderViewer: (renderProps: RenderViewer) => {
            let { slot } = renderProps;
            plugins.forEach((plugin) => {
                if (plugin.renderViewer) {
                    slot = plugin.renderViewer({ ...renderProps, slot });
                }
            });

            const mergeSubSlot =
                slot.subSlot && slot.subSlot.attrs
                    ? {
                          ref: slot.subSlot.attrs.ref,
                          style: slot.subSlot.attrs.style,
                      }
                    : {};

            slot.children = (
                <div className="rpv-default-layout__container">
                    <div className="rpv-default-layout__toolbar">
                        {props && props.renderToolbar ? props.renderToolbar(Toolbar) : <Toolbar />}
                    </div>
                    <div className="rpv-default-layout__main">
                        <Sidebar
                            attachmentTabContent={<Attachments />}
                            bookmarkTabContent={<Bookmarks />}
                            store={store}
                            thumbnailTabContent={<Thumbnails />}
                            tabs={sidebarTabs}
                        />
                        <div className="rpv-default-layout__body" {...mergeSubSlot}>
                            {slot.subSlot.children}
                        </div>
                    </div>
                    {slot.children}
                </div>
            );

            // Reset the sub slot
            slot.subSlot.attrs = {};
            slot.subSlot.children = <></>;

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
    };
};

export default defaultLayoutPlugin;
