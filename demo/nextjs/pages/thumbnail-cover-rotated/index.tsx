import { Viewer, type Plugin, type RenderViewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import * as React from 'react';

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

const ThumbnailCover: React.FC<{
    fileUrl: string;
    pageIndex: number;
}> = ({ fileUrl, pageIndex }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => pageIndex} />,
    });

    return <Viewer fileUrl={fileUrl} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />;
};

const IndexPage = () => (
    <div
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            height: '40rem',
            margin: '5rem auto',
            width: '40rem',
        }}
    >
        <ThumbnailCover fileUrl="/pdf-open-parameters-rotated.pdf" pageIndex={3} />
    </div>
);

export default IndexPage;
