import * as React from 'react';
import { Plugin, RenderViewer, Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

interface PageThumbnailPluginProps {
    PageThumbnail: React.ReactElement;
}

const pageThumbnailPlugin = (props: PageThumbnailPluginProps): Plugin => {
    const { PageThumbnail } = props;

    return {
        renderViewer: (renderProps: RenderViewer) => {
            let { slot } = renderProps;

            slot.children = PageThumbnail;

            // Reset the sub slot
            slot.subSlot.attrs = {};
            slot.subSlot.children = <></>;

            return slot;
        },
    };
};

const IndexPage = () => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => 0} />,
    });

    return (
        <div
            style={{
                height: '20rem',
                margin: '5rem auto',
                width: '20rem',
            }}
        >
            <Viewer
                fileUrl="/pdf-open-parameters.pdf"
                plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
            />
        </div>
    );
};

export default IndexPage;
