import React from 'react';
import Viewer, { PrimaryButton, RenderViewerProps } from '@phuocng/react-pdf-viewer';

interface JumpToPageProps {
    fileUrl: string;
}

const JumpToPage: React.FC<JumpToPageProps> = ({ fileUrl }) => {
    const render = (props: RenderViewerProps) => {
        return (
            <div>
                <div style={{ height: '500px', marginBottom: '16px' }}>
                    {props.viewer}
                </div>
                <div style={{ alignItems: 'center', display: 'flex' }}>
                    <div style={{ marginRight: '12px' }}>
                        <PrimaryButton onClick={() => props.jumpToPage(2)}>Jump to page 3</PrimaryButton>
                    </div>
                    <div>
                        <PrimaryButton onClick={() => props.rotate(90)}>Rotate +90 degrees</PrimaryButton>
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

export default JumpToPage;
