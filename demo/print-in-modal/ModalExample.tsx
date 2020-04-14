import Viewer from '@phuocng/react-pdf-viewer';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import './modalExample.css';

const ModalExample: React.FC<{}> = () => {
    const [shown, setShown] = useState(false);

    const modalBody = () => (
        <div
            className="example-modal"
            style={{
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',

                /* Fixed position */
                left: 0,
                position: 'fixed',
                top: 0,

                /* Take full size */
                height: '100%',
                width: '100%',

                /* Displayed on top of other elements */
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#000',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '.5rem',
                }}
            >
                <div>sample-file-name.pdf</div>
                <button
                    style={{
                        backgroundColor: '#357edd',
                        border: 'none',
                        borderRadius: '.25rem',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '.25rem',
                    }}
                    onClick={() => setShown(false)}
                >
                    Close
                </button>
            </div>
            <div
                style={{
                    flexGrow: 1,
                    overflow: 'auto',
                }}
            >
                <Viewer fileUrl="/assets/pdf-open-parameters.pdf" />
            </div>
        </div>
    );

    return (
        <>
            <button
                style={{
                    backgroundColor: '#00449e',
                    border: 'none',
                    borderRadius: '.25rem',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '.5rem',
                }}
                onClick={() => setShown(true)}
            >
                Open modal
            </button>
            {shown && ReactDOM.createPortal(modalBody(), document.body)}
        </>
    );
};

export default ModalExample;
