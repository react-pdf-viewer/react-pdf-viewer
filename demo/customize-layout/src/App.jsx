import React from 'react';
import { Worker } from 'pdfviewer';

import AlwaysShowSidebar from './AlwaysShowSidebar';
import SimpleToolbar from './SimpleToolbar';

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div style={{ margin: '32px 0' }}>
                <h2>Simple toolbar</h2>
                <div
                    style={{
                        height: '500px',
                    }}
                >
                    <SimpleToolbar fileUrl="/pdf-open-parameters.pdf" />
                </div>

                <h2>Always showing the sidebar</h2>
                <div
                    style={{
                        height: '500px',
                    }}
                >
                    <AlwaysShowSidebar fileUrl="/pdf-open-parameters.pdf" />
                </div>
            </div>
        </Worker>
    );
};

export default App;
