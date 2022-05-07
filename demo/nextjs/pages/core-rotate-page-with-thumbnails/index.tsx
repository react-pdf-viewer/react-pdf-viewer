import type { RenderPage, RenderPageProps } from '@react-pdf-viewer/core';
import { MinimalButton, Position, RotateDirection, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { RotateBackwardIcon, RotateForwardIcon } from '@react-pdf-viewer/rotate';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import * as React from 'react';

const TOOLTIP_OFFSET = { left: 0, top: 8 };

const IndexPage = () => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    const renderPage: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            <div
                style={{
                    padding: '0.25rem',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    transform: 'translate(100%, 0)',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '0 auto',
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
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    );

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                height: '50rem',
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    width: '20%',
                }}
            >
                <Thumbnails />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer
                    defaultScale={0.5}
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[thumbnailPluginInstance]}
                    renderPage={renderPage}
                />
            </div>
        </div>
    );
};

export default IndexPage;
