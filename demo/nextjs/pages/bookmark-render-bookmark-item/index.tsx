import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import type { RenderBookmarkItemProps } from '@react-pdf-viewer/bookmark';
import { Icon, Viewer } from '@react-pdf-viewer/core';
import * as React from 'react';

const ExpandIcon = () => (
    <Icon size={16}>
        <path d="M.541,5.627,11.666,18.2a.5.5,0,0,0,.749,0L23.541,5.627" />
    </Icon>
);

const CollapseIcon = () => (
    <Icon size={16}>
        <path d="M5.651,23.5,18.227,12.374a.5.5,0,0,0,0-.748L5.651.5" />
    </Icon>
);

const IndexPage = () => {
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

    const renderBookmarkItem = (renderProps: RenderBookmarkItemProps) =>
        renderProps.defaultRenderItem(
            renderProps.onClickItem,
            <>
                {renderProps.defaultRenderToggle(<ExpandIcon />, <CollapseIcon />)}
                {renderProps.defaultRenderTitle(renderProps.onClickTitle)}
            </>
        );

    return (
        <div
            data-testid="root"
            style={{
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    height: '50rem',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                        width: '25%',
                    }}
                >
                    <Bookmarks renderBookmarkItem={renderBookmarkItem} />
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[bookmarkPluginInstance]} />
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
