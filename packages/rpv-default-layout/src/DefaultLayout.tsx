/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import Viewer, { Plugin, ViewerProps } from '@phuocng/rpv';
import attachmentPlugin from '@phuocng/rpv-attachment';
import bookmarkPlugin from '@phuocng/rpv-bookmark';
import thumbnailPlugin from '@phuocng/rpv-thumbnail';
import toolbarPlugin, { ToolbarPluginProps } from '@phuocng/rpv-toolbar';

import '@phuocng/rpv-attachment/cjs/rpv-attachment.css';
import '@phuocng/rpv-bookmark/cjs/rpv-bookmark.css';
import '@phuocng/rpv-thumbnail/cjs/rpv-thumbnail.css';
import '@phuocng/rpv-toolbar/cjs/rpv-toolbar.css';

import './defaultLayout.less';
import Sidebar from './Sidebar';

export interface DefaultLayoutProps extends ViewerProps {
    toolbarPlugin?: ToolbarPluginProps;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
    const attachmentPluginInstance = attachmentPlugin();
    const bookmarkPluginInstance = bookmarkPlugin();
    const thumbnailPluginInstance = thumbnailPlugin();
    const toolbarPluginInstance = toolbarPlugin(props ? props.toolbarPlugin : {});

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

    return (
        <div className='rpv-default-layout-container'>
            <div className='rpv-default-layout-toolbar'>
                <Toolbar />
            </div>
            <div className='rpv-default-layout-main'>
                <Sidebar
                    tabContents={[
                        () => <Thumbnails />,
                        () => <Bookmarks />,
                        () => <Attachments />,
                    ]}
                />
                <div className='rpv-default-layout-body'>
                    <Viewer
                        {...props}
                        plugins={plugins}
                    />
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
