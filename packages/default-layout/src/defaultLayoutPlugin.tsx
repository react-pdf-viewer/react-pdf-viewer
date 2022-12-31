/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { AttachmentPlugin } from '@react-pdf-viewer/attachment';
import { attachmentPlugin } from '@react-pdf-viewer/attachment';
import type { BookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import type {
    PdfJs,
    Plugin,
    PluginFunctions,
    PluginOnAnnotationLayerRender,
    PluginOnDocumentLoad,
    PluginOnTextLayerRender,
    PluginRenderPageLayer,
    RenderViewer,
    ViewerState,
} from '@react-pdf-viewer/core';
import { classNames, createStore, TextDirection } from '@react-pdf-viewer/core';
import type { ThumbnailPlugin, ThumbnailPluginProps } from '@react-pdf-viewer/thumbnail';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import type { ToolbarPlugin, ToolbarPluginProps, ToolbarProps } from '@react-pdf-viewer/toolbar';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import * as React from 'react';
import { Sidebar, SidebarTab } from './Sidebar';
import type { StoreProps } from './types/StoreProps';

export interface DefaultLayoutPlugin extends Plugin {
    activateTab(index: number): void;
    toggleTab(index: number): void;
    readonly attachmentPluginInstance: AttachmentPlugin;
    readonly bookmarkPluginInstance: BookmarkPlugin;
    readonly thumbnailPluginInstance: ThumbnailPlugin;
    readonly toolbarPluginInstance: ToolbarPlugin;
}

export interface DefaultLayoutPluginProps {
    thumbnailPlugin?: ThumbnailPluginProps;
    toolbarPlugin?: ToolbarPluginProps;
    renderToolbar?: (Toolbar: (props: ToolbarProps) => React.ReactElement) => React.ReactElement;
    setInitialTab?: (doc: PdfJs.PdfDocument) => Promise<number>;
    sidebarTabs?: (defaultTabs: SidebarTab[]) => SidebarTab[];
}

export const defaultLayoutPlugin = (props?: DefaultLayoutPluginProps): DefaultLayoutPlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                isCurrentTabOpened: false,
                currentTab: 0,
            }),
        []
    );

    const attachmentPluginInstance = attachmentPlugin();
    const bookmarkPluginInstance = bookmarkPlugin();
    const thumbnailPluginInstance = thumbnailPlugin(props ? props.thumbnailPlugin : {});
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
        toggleTab: (index: number) => {
            // Get the current active tab
            const currentTab = store.get('currentTab');
            store.update('isCurrentTabOpened', !store.get('isCurrentTabOpened'));
            if (currentTab !== index) {
                store.update('currentTab', index);
            }
        },
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
                        <React.Fragment key={idx}>
                            <></>
                        </React.Fragment>
                    )
                )}
            </React.Fragment>
        ),
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
                          className: slot.subSlot.attrs.className,
                          'data-testid': slot.subSlot.attrs['data-testid'],
                          ref: slot.subSlot.attrs.ref,
                          style: slot.subSlot.attrs.style,
                      }
                    : {};

            slot.children = (
                <div className="rpv-default-layout__container">
                    <div
                        data-testid="default-layout__main"
                        className={classNames({
                            'rpv-default-layout__main': true,
                            'rpv-default-layout__main--rtl':
                                renderProps.themeContext.direction === TextDirection.RightToLeft,
                        })}
                    >
                        <Sidebar
                            attachmentTabContent={<Attachments />}
                            bookmarkTabContent={<Bookmarks />}
                            store={store}
                            thumbnailTabContent={<Thumbnails />}
                            tabs={sidebarTabs}
                        />
                        <div className="rpv-default-layout__body" data-testid="default-layout__body">
                            <div className="rpv-default-layout__toolbar">
                                {props && props.renderToolbar ? props.renderToolbar(Toolbar) : <Toolbar />}
                            </div>
                            <div {...mergeSubSlot}>{slot.subSlot.children}</div>
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
        onDocumentLoad: (documentLoadProps: PluginOnDocumentLoad) => {
            plugins.forEach((plugin) => {
                if (plugin.onDocumentLoad) {
                    plugin.onDocumentLoad(documentLoadProps);
                }
            });
            if (props && props.setInitialTab) {
                props.setInitialTab(documentLoadProps.doc).then((initialTab) => {
                    store.update('currentTab', initialTab);
                    store.update('isCurrentTabOpened', true);
                });
            }
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
