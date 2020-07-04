import React from 'react';
import Viewer, { Worker } from '@phuocng/rpv';
import currentPagePlugin from '@phuocng/rpv-current-page';
import pageNavigationPlugin from '@phuocng/rpv-page-navigation';

// import '@phuocng/rpv/cjs/react-pdf-viewer.css';

const currentPage = currentPagePlugin();
const pageNavigation = pageNavigationPlugin();
const { CurrentPageLabel } = currentPage;
const { NextPageButton, PreviousPageButton } = pageNavigation;

const App = () => {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.js">
            <div style={{ display: 'flex' }}>
                <PreviousPageButton />
                <CurrentPageLabel />
                <NextPageButton>
                {
                    (props) => (
                        <button onClick={props.onClick} disabled={props.isDisabled}>Go to next page</button>
                    )
                }
                </NextPageButton>
            </div>
            <div style={{ height: '750px', padding: '16px 0' }}>
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[
                        currentPage,
                        pageNavigation
                    ]}
                />
            </div>
        </Worker>
    );
};

export default App;
