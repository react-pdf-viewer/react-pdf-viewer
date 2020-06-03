import React from 'react';
import Viewer, { PageChangeEvent } from '@phuocng/react-pdf-viewer';

const StoreCurrentPageExample: React.FC<{}> = () => {
    const handlePageChange = (e: PageChangeEvent) => {
        localStorage.setItem('current-page', `${e.currentPage}`);
    };

    const initialPage = localStorage.getItem('current-page')
        ? parseInt(localStorage.getItem('current-page'), 10)
        : 0;

    return (
        <div style={{ height: '750px', padding: '16px 0' }}>
            <Viewer
                fileUrl="/pdf-open-parameters.pdf"
                initialPage={initialPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default StoreCurrentPageExample;
