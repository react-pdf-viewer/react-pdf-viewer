/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Plugin, PluginFunctions, PluginOnDocumentLoad, PluginOnTextLayerRender, RenderViewer, Slot, ViewerState } from '@phuocng/rpv';
import attachmentPlugin from '@phuocng/rpv-attachment';
import bookmarkPlugin from '@phuocng/rpv-bookmark';
import thumbnailPlugin from '@phuocng/rpv-thumbnail';
import toolbarPlugin from '@phuocng/rpv-toolbar';

import '@phuocng/rpv-attachment/cjs/rpv-attachment.css';
import '@phuocng/rpv-bookmark/cjs/rpv-bookmark.css';
import '@phuocng/rpv-thumbnail/cjs/rpv-thumbnail.css';
import '@phuocng/rpv-toolbar/cjs/rpv-toolbar.css';

import './defaultLayout.less';
import Sidebar from './Sidebar';

const defaultLayoutPlugin = (): Plugin => {
    const attachmentPluginInstance = attachmentPlugin();
    const bookmarkPluginInstance = bookmarkPlugin();
    const thumbnailPluginInstance = thumbnailPlugin();
    const toolbarPluginInstance = toolbarPlugin();

    const { Attachments } = attachmentPluginInstance;
    const { Bookmarks } = bookmarkPluginInstance;
    const { Thumbnails } = thumbnailPluginInstance;
    const { Toolbar } = toolbarPluginInstance;

    const plugins: Plugin[] = [
        attachmentPluginInstance,
        bookmarkPluginInstance,
        thumbnailPluginInstance,
        toolbarPluginInstance,
    ];

    const attachToolbarAndSidebar = (props: RenderViewer): Slot => {
        let { slot } = props;

        if (slot.attrs) {
            const currentClasses = slot.attrs && slot.attrs.className ? slot.attrs.className : '';
            slot.attrs.className = `${currentClasses} rpv-default-layout-container`;
        }

        slot.children = (
            <>
            <div className='rpv-default-layout-toolbar'>
                <Toolbar />
            </div>
            {slot.children}
            </>
        );
        if (slot.subSlot) {
            const attrs = slot.subSlot.attrs || {};
            slot.subSlot.attrs = {
                ...slot.subSlot.attrs,
                className: `${attrs.className || ''} rpv-default-layout-main`,
            };
            slot.subSlot.children = (
                <>
                <Sidebar
                    tabContents={[
                        () => <Thumbnails />,
                        () => <Bookmarks />,
                        () => <Attachments />,
                    ]}
                />
                <div className='rpv-default-layout-body'>
                    {slot.subSlot.children}
                </div>
                </>
            );
        }

        return slot;
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            // Install plugins
            plugins.forEach(plugin => {
                if (plugin.install) {
                    plugin.install(pluginFunctions);
                }
            });
        },
        renderViewer: (props: RenderViewer) => {
            let slot = attachToolbarAndSidebar(props);
            plugins.forEach(plugin => {
                if (plugin.renderViewer) {
                    slot = plugin.renderViewer({...props, slot});
                }
            });
            return slot;
        },
        uninstall: (pluginFunctions: PluginFunctions) => {
            // Unistall plugins
            plugins.forEach(plugin => {
                if (plugin.uninstall) {
                    plugin.uninstall(pluginFunctions);
                }
            });
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            plugins.forEach(plugin => {
                if (plugin.onDocumentLoad) {
                    plugin.onDocumentLoad(props);
                }
            });
        },
        onTextLayerRender: (props: PluginOnTextLayerRender) => {
            plugins.forEach(plugin => {
                if (plugin.onTextLayerRender) {
                    plugin.onTextLayerRender(props);
                }
            });
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            let newState = viewerState;
            plugins.forEach(plugin => {
                if (plugin.onViewerStateChange) {
                    newState = plugin.onViewerStateChange(newState);
                }
            });
            return newState;
        },
    };
};

export default defaultLayoutPlugin;
