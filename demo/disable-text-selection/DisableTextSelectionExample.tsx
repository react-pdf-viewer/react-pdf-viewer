import React from 'react';
import Viewer, { RenderPageProps } from '@phuocng/react-pdf-viewer';

interface DisableTextSelectionExampleProps {
    fileUrl: string;
}

const DisableTextSelectionExample: React.FC<DisableTextSelectionExampleProps> = ({ fileUrl }) => {
    const renderPage = (props: RenderPageProps) => {
        return (
            <>
                {props.canvasLayer.children}
                <div style={{ userSelect: 'none' }}>
                    {props.textLayer.children}
                </div>
                {props.annotationLayer.children}
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

export default DisableTextSelectionExample;
