import React from 'react';
import Viewer, { RenderPageProps } from '@phuocng/react-pdf-viewer';

interface SvgLayerExampleProps {
    fileUrl: string;
}

const SvgLayerExample: React.FC<SvgLayerExampleProps> = ({ fileUrl }) => {
    const renderPage = (props: RenderPageProps) => {
        return (
            <>
                {props.svgLayer.children}
                {props.textLayer.children}
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

export default SvgLayerExample;
