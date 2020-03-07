import React from 'react';
import Viewer, { PrimaryButton, RenderViewerProps, ScrollMode, SpecialZoomLevel, SelectionMode } from '@phuocng/react-pdf-viewer';

interface RenderPropsExampleProps {
    fileUrl: string;
}

const RenderPropsExample: React.FC<RenderPropsExampleProps> = ({ fileUrl }) => {
    const render = (props: RenderViewerProps) => {
        return (
            <div style={{ padding: '16px 0' }}>
                <div style={{ height: '500px', marginBottom: '16px' }}>
                    {props.viewer}
                </div>
                <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.jumpToPage(2)}>Jump to page 3</PrimaryButton>
                    </div>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.jumpToPage(props.doc.numPages - 1)}>Jump to last page</PrimaryButton>
                    </div>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.rotate(90)}>Rotate +90 degrees</PrimaryButton>
                    </div>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.zoom(0.5)}>Zoom to 50%</PrimaryButton>
                    </div>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.zoom(SpecialZoomLevel.ActualSize)}>Zoom to actual size</PrimaryButton>
                    </div>
                </div>
                <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.changeScrollMode(ScrollMode.Wrapped)}>Switch to wrapped scrolling</PrimaryButton>
                    </div>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.changeSelectionMode(SelectionMode.Hand)}>Switch to hand tool</PrimaryButton>
                    </div>
                </div>
                <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.print()}>Print</PrimaryButton>
                    </div>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.download()}>Download</PrimaryButton>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            render={render}
        />
    );
};

export default RenderPropsExample;
