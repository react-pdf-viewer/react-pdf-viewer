/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

import LocalizationContext from '../localization/LocalizationContext';

interface PrintProgressProps {
    progress: number;
}

const PrintProgress: React.FC<PrintProgressProps> = ({ progress }) => {
    const l10n = React.useContext(LocalizationContext);

    return (
        <div
            style={{
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, .2)',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                left: 0,
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    padding: '24px',
                    textAlign: 'center',
                    width: '240px',
                }}
            >
                <div style={{ marginBottom: '8px' }}>{l10n.printProgress.preparingDocument}</div>
                <div
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, .1)',
                        borderRadius: '9999px',
                        marginBottom: '16px',
                    }}
                >
                    <div
                        style={{
                            alignItems: 'center',
                            backgroundColor: '#357EDD',
                            borderRadius: '9999px',
                            color: '#fff',
                            display: 'flex',
                            fontSize: '10px',
                            justifyContent: 'center',
                            width: `${progress}%`,
                        }}
                    >
                        {progress}%
                    </div>
                </div>
                <button
                    style={{
                        backgroundColor: '#357EDD',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#FFF',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                >
                    {l10n.printProgress.cancel}
                </button>
            </div>
        </div>
    );
};

export default PrintProgress;
