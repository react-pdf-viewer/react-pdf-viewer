/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Plugin, Viewer, ViewerProps } from '@react-pdf-viewer/core';
import { attachmentPlugin } from '@react-pdf-viewer/attachment';
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { toolbarPlugin, ToolbarPluginProps } from '@react-pdf-viewer/toolbar';

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
                        plugins={plugins.concat(props.plugins || [])}
                    />
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
