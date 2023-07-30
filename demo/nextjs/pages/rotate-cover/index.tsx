import { Plugin, PrimaryButton, RenderViewer, RotateDirection, Viewer } from '@react-pdf-viewer/core';
import { rotatePlugin } from '@react-pdf-viewer/rotate';
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

const IndexPage = () => {
    const rotatePluginInstance = rotatePlugin();
    const { RotatePage } = rotatePluginInstance;

    const pageIndex = 3;

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => pageIndex} />,
    });

    return (
        <div
            data-testid="root"
            className="rpv-core__viewer"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '4px',
                }}
            >
                <div style={{ padding: '0 0.25rem' }}>
                    <RotatePage>
                        {(props) => (
                            <PrimaryButton
                                testId="rotate-forward"
                                onClick={() => props.onRotatePage(pageIndex, RotateDirection.Forward)}
                            >
                                Rotate the cover
                            </PrimaryButton>
                        )}
                    </RotatePage>
                </div>
                <div style={{ padding: '0 0.25rem' }}>
                    <RotatePage>
                        {(props) => (
                            <PrimaryButton
                                testId="rotate-backward"
                                onClick={() => props.onRotatePage(pageIndex, RotateDirection.Backward)}
                            >
                                Rotate the cover backward
                            </PrimaryButton>
                        )}
                    </RotatePage>
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer
                    defaultScale={0.5}
                    fileUrl="/pdf-open-parameters-rotated.pdf"
                    plugins={[pageThumbnailPluginInstance, rotatePluginInstance, thumbnailPluginInstance]}
                />
            </div>
        </div>
    );
};

export default IndexPage;
