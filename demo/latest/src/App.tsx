import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import currentPagePlugin from './current-page';
import pageNavigationPlugin from './page-navigation';

// const currentPage = currentPagePlugin();
const pageNavigation = pageNavigationPlugin();
//const { CurrentPageLabel } = currentPage;
const { NextPageButton, PreviousPageButton } = pageNavigation;

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <div style={{ display: 'flex' }}>
                <NextPageButton />
                <PreviousPageButton />
                {/* <CurrentPageLabel /> */}
            </div>
            <div style={{ height: '750px', padding: '16px 0' }}>
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[
                        // currentPage,
                        pageNavigation
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
