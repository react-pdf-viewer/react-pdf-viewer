import { MinimalButton, Position, RotateDirection, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { ThumbnailIcon, defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { RotateBackwardIcon, RotateForwardIcon } from '@react-pdf-viewer/rotate';
import { type RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const IndexPage = () => {
    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <div
            key={props.key}
            className="custom-thumbnail-item"
            data-testid={`thumbnail-${props.pageIndex}`}
            style={{
                backgroundColor: props.pageIndex === props.currentPage ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
                width: '100%',
            }}
        >
            <div style={{ marginBottom: '0.5rem' }} onClick={props.onJumpToPage}>
                {props.renderPageThumbnail}
            </div>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '0 auto',
                    width: '100px',
                }}
            >
                <Tooltip
                    position={Position.BottomCenter}
                    target={
                        <MinimalButton
                            testId={`rotate-forward-${props.pageIndex}`}
                            onClick={() => props.onRotatePage(RotateDirection.Forward)}
                        >
                            <RotateForwardIcon />
                        </MinimalButton>
                    }
                    content={() => 'Rotate clockwise'}
                    offset={TOOLTIP_OFFSET}
                />
                <Tooltip
                    position={Position.BottomCenter}
                    target={
                        <MinimalButton
                            testId={`rotate-backward-${props.pageIndex}`}
                            onClick={() => props.onRotatePage(RotateDirection.Backward)}
                        >
                            <RotateBackwardIcon />
                        </MinimalButton>
                    }
                    content={() => 'Rotate counterclockwise'}
                    offset={TOOLTIP_OFFSET}
                />
            </div>
        </div>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) =>
            [
                {
                    content: <Thumbnails renderThumbnailItem={renderThumbnailItem} />,
                    icon: <ThumbnailIcon />,
                    title: 'Thumbnails',
                },
            ].concat(defaultTabs.slice(1)),
    });

    const thumbnailPluginInstance = defaultLayoutPluginInstance.thumbnailPluginInstance;
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            style={{
                margin: '1rem auto',
                height: '50rem',
                width: '64rem',
            }}
        >
            <Viewer defaultScale={0.5} fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

export default IndexPage;
