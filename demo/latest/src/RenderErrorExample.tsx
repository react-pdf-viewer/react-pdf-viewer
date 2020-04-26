import React from 'react';
import Viewer, { LoadError } from '@phuocng/react-pdf-viewer';

interface RenderErrorExampleProps {
    fileUrl: string;
}

const RenderErrorExample: React.FC<RenderErrorExampleProps> = ({ fileUrl }) => {
    const renderError = (error: LoadError) => {
        let message = '';
        switch (error.name) {
            case 'InvalidPDFException':
                message = 'The document is invalid or corrupted';
                break;
            case 'MissingPDFException':
                message = 'The document is missing';
                break;
            case 'UnexpectedResponseException':
                message = 'Unexpected server response';
                break;
            default:
                message = 'Cannot load the document';
                break;
        }

        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <div
                    style={{
                        backgroundColor: '#e53e3e',
                        borderRadius: '0.25rem',
                        color: '#fff',
                        padding: '0.5rem',
                    }}
                >
                    {message}
                </div>
            </div>
        );
    };

    return (
        <Viewer
            fileUrl={fileUrl}
            renderError={renderError}
        />
    );
};

export default RenderErrorExample;
