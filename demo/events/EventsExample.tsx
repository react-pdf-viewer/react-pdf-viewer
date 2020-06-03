import React from 'react';
import Viewer, { DocumentLoadEvent, ZoomEvent } from '@phuocng/react-pdf-viewer';

const EventsExample: React.FC<{}> = () => {
    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        console.log(`Document is loaded. Number of pages: ${e.doc.numPages}`);
    };

    const handleZoom = (e: ZoomEvent) => {
        console.log(`Zoom to ${e.scale}`);
    };

    return (
        <div style={{ height: '750px', padding: '16px 0' }}>
            <Viewer
                fileUrl="/pdf-open-parameters.pdf"
                onDocumentLoad={handleDocumentLoad}
                onZoom={handleZoom}
            />
        </div>
    );
};

export default EventsExample;
