import { MinimalButton, ScrollMode, SpecialZoomLevel, Viewer, ViewMode } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { NextIcon, pageNavigationPlugin, PreviousIcon } from '@react-pdf-viewer/page-navigation';
import { thumbnailPlugin, ThumbnailDirection } from '@react-pdf-viewer/thumbnail';

const IndexPage = () => {
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { jumpToNextPage, jumpToPreviousPage } = pageNavigationPluginInstance;

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                flexDirection: 'column',
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    borderBottom: '1px solid rgba(0, 0, 0, .3)',
                    height: '40rem',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '1rem',
                        transform: 'translate(0, -100%) rotate(-90deg)',
                        zIndex: '1',
                    }}
                >
                    <MinimalButton onClick={jumpToPreviousPage}>
                        <PreviousIcon />
                    </MinimalButton>
                </div>
                <Viewer
                    defaultScale={SpecialZoomLevel.PageFit}
                    scrollMode={ScrollMode.Page}
                    viewMode={ViewMode.DualPageWithCover}
                    fileUrl={'/pdf-open-parameters.pdf'}
                    plugins={[pageNavigationPluginInstance, thumbnailPluginInstance]}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '1rem',
                        transform: 'translate(0, -100%) rotate(-90deg)',
                        zIndex: '1',
                    }}
                >
                    <MinimalButton onClick={jumpToNextPage}>
                        <NextIcon />
                    </MinimalButton>
                </div>
            </div>
            <div
                style={{
                    height: '12rem',
                    overflow: 'auto',
                }}
            >
                <Thumbnails thumbnailDirection={ThumbnailDirection.Horizontal} />
            </div>
        </div>
    );
};

export default IndexPage;
