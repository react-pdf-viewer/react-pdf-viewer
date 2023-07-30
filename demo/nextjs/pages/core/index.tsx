import { Viewer } from '@react-pdf-viewer/core';

const IndexPage = () => {
    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <Viewer fileUrl="/pdf-open-parameters.pdf" />
        </div>
    );
};

export default IndexPage;
