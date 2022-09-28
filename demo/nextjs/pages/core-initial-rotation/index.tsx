import { Viewer } from '@react-pdf-viewer/core';
import * as React from 'react';

const IndexPage = () => (
    <div
        style={{
            border: '1px solid rgba(0, 0, 0, .3)',
            display: 'flex',
            height: '50rem',
            margin: '5rem auto',
            width: '50rem',
        }}
    >
        <Viewer fileUrl="/pdf-open-parameters.pdf" initialRotation={90} />
    </div>
);

export default IndexPage;
