import React from 'react';
import Viewer from '@phuocng/react-pdf-viewer';

const KeywordExample: React.FC<{}> = () => (
    <div style={{ height: '750px', padding: '16px 0' }}>
        <Viewer
            fileUrl="/pdf-open-parameters.pdf"
            // keyword='PDF Library'
            keyword={new RegExp('pdf document', 'i')}
        />
    </div>
);

export default KeywordExample;
