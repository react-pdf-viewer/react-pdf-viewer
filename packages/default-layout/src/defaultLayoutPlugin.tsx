/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { attachmentPlugin, type AttachmentPlugin } from '@react-pdf-viewer/attachment';
import { bookmarkPlugin, type BookmarkPlugin } from '@react-pdf-viewer/bookmark';
import {
    TextDirection,
    classNames,
    createStore,
    type PdfJs,
    type Plugin,
    type PluginOnDocumentLoad,
    type RenderViewer,
} from '@react-pdf-viewer/core';
import { thumbnailPlugin, type ThumbnailPlugin, type ThumbnailPluginProps } from '@react-pdf-viewer/thumbnail';
import {
    toolbarPlugin,
    type ToolbarPlugin,
    type ToolbarPluginProps,
    type ToolbarProps,
} from '@react-pdf-viewer/toolbar';
import * as React from 'react';
import { Sidebar, SidebarTab } from './Sidebar';
import styles from './styles/defaultLayout.module.css';
import { type StoreProps } from './types/StoreProps';

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
                currentTab: -1,
            }),
        [],
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
        dependencies: plugins,
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
        renderViewer: (renderProps: RenderViewer) => {
            const { slot } = renderProps;
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
                <div className={styles.container}>
                    <div
                        data-testid="default-layout__main"
                        className={classNames({
                            [styles.main]: true,
                            [styles.mainRtl]: renderProps.themeContext.direction === TextDirection.RightToLeft,
                        })}
                    >
                        <Sidebar
                            attachmentTabContent={<Attachments />}
                            bookmarkTabContent={<Bookmarks />}
                            store={store}
                            thumbnailTabContent={<Thumbnails />}
                            tabs={sidebarTabs}
                        />
                        <div className={styles.body} data-testid="default-layout__body">
                            <div className={styles.toolbar}>
                                {props && props.renderToolbar ? props.renderToolbar(Toolbar) : <Toolbar />}
                            </div>
                            <div {...mergeSubSlot}>{slot.subSlot!.children}</div>
                        </div>
                    </div>
                    {slot.children}
                </div>
            );

            // Reset the sub slot
            slot.subSlot!.attrs = {};
            slot.subSlot!.children = <></>;

            return slot;
        },
        onDocumentLoad: (documentLoadProps: PluginOnDocumentLoad) => {
            if (props && props.setInitialTab) {
                props.setInitialTab(documentLoadProps.doc).then((initialTab) => {
                    store.update('currentTab', initialTab);
                    store.update('isCurrentTabOpened', true);
                });
            }
        },
    };
};
