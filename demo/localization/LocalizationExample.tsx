import Viewer, { LocalizationMap } from '@phuocng/react-pdf-viewer';
import React from 'react';

import vi_VN from './vi_VN.json';

const LocalizationExample: React.FC<{}> = () => (
    <div style={{ height: '750px', padding: '16px 0' }}>
        <Viewer
            fileUrl="/pdf-open-parameters.pdf"
            localization={(vi_VN as any) as LocalizationMap}
        />
    </div>
);

export default LocalizationExample;
