import React from 'react';
import Viewer, { RenderPageProps } from '@phuocng/react-pdf-viewer';

interface CanvasLayerExampleProps {
    fileUrl: string;
}

const CanvasLayerExample: React.FC<CanvasLayerExampleProps> = ({ fileUrl }) => {
    const renderPage = (props: RenderPageProps) => {
        return (
            <>
                {props.canvasLayer.children}
            </>
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            renderPage={renderPage}
        />
    );
};

export default CanvasLayerExample;
