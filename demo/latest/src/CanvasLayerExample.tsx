import React from 'react';
import Viewer, { RenderPageProps } from '../../packages/rpv/npm';

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
