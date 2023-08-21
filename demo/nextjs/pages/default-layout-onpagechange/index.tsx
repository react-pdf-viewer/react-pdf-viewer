import { Viewer, type PageChangeEvent } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as React from 'react';

const IndexPage = () => {
    const [visitedPages, setVisitedPages] = React.useState([]);
    const [count, setCount] = React.useState(0);
    const handlePageChange = (e: PageChangeEvent) => {
        setCount((c) => c + 1);
        setVisitedPages((visitedPages) => visitedPages.concat(e.currentPage));
    };
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div
            data-testid="root"
            style={{
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <div style={{ margin: '0.5rem 0' }}>
                Visited pages: <span data-testid={`visited-pages-${count}`}>{visitedPages.join(', ')}</span>
            </div>
            <div
                style={{
                    display: 'flex',
                    height: '50rem',
                    width: '100%',
                }}
            >
                <Viewer
                    fileUrl="/pdf-open-parameters.pdf"
                    plugins={[defaultLayoutPluginInstance]}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default IndexPage;
