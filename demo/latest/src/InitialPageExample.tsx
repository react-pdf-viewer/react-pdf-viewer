import React from 'react';
import Viewer from '@phuocng/react-pdf-viewer';

const InitialPageExample: React.FC<{}> = () => (
    <div style={{ height: '750px', padding: '16px 0' }}>
        <Viewer
            fileUrl="/pdf-open-parameters.pdf"
            initialPage={2}
        />
    </div>
);

export default InitialPageExample;
