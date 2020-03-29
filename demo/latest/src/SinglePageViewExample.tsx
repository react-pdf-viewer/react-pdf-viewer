import React from 'react';
import Viewer, { SpecialZoomLevel } from '@phuocng/react-pdf-viewer';

interface SinglePageViewExampleProps {
    fileUrl: string;
}

const SinglePageViewExample: React.FC<SinglePageViewExampleProps> = ({ fileUrl }) => {
    return (
        <Viewer
            fileUrl={fileUrl}
            defaultScale={SpecialZoomLevel.PageFit}
        />
    );
};

export default SinglePageViewExample;
