import React from 'react';
import Viewer, { SpecialZoomLevel } from '@phuocng/react-pdf-viewer';

import './disableScroll.css';

interface DisableScrollExampleProps {
    fileUrl: string;
}

const DisableScrollExample: React.FC<DisableScrollExampleProps> = ({ fileUrl }) => {
    return (
        <Viewer
            fileUrl={fileUrl}
            defaultScale={SpecialZoomLevel.PageFit}
        />
    );
};

export default DisableScrollExample;
