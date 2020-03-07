import React from 'react';
import Viewer, { Button, RenderViewerProps } from '@phuocng/react-pdf-viewer';

interface JumpToPageProps {
    fileUrl: string;
}

const JumpToPage: React.FC<JumpToPageProps> = ({ fileUrl }) => {
    const render = (props: RenderViewerProps) => {
        return (
            <div>
                <div style={{ height: '500px' }}>
                    {props.viewer}
                </div>
                <div style={{ marginTop: '16px' }}>
                    <Button onClick={() => props.jumpToPage(2)}>Jump to page 3</Button>
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
