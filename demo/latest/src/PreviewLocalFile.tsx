import Viewer from '@phuocng/react-pdf-viewer';
import React from 'react';

const PreviewLocalFile: React.FC<{}> = () => {
    const [url, setUrl] = React.useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        (files.length > 0) && setUrl(URL.createObjectURL(files[0]));
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={onChange} />

            <div className="mt4" style={{ height: '750px' }}>
                {
                    url
                        ? <Viewer fileUrl={url} />
                        : (
                            <div
                                style={{
                                    alignItems: 'center',
                                    border: '2px dashed rgba(0, 0, 0, .3)',
                                    display: 'flex',
                                    fontSize: '2rem',
                                    height: '100%',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                Preview area
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default PreviewLocalFile;
