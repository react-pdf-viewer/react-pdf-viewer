import { Button, Spinner, Viewer } from '@react-pdf-viewer/core';
import { printPlugin, type RenderPrintProps } from '@react-pdf-viewer/print';
import * as React from 'react';

const IndexPage = () => {
    const renderProgressBar = React.useCallback(
        (numLoadedPages: number, numPages: number, onCancel: () => void) => (
            <div
                style={{
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, .5)',
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
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '0.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        width: '20rem',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        Preparing {numLoadedPages}/{numPages} pages ...
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <Spinner />
                    </div>
                    <Button onClick={onCancel}>Cancel</Button>
                </div>
            </div>
        ),
        [],
    );

    const printPluginInstance = printPlugin({
        renderProgressBar,
    });
    const { Print } = printPluginInstance;

    return (
        <div
            data-testid="root"
            style={{
                display: 'flex',
                border: '1px solid rgba(0, 0, 0, .2)',
                flexDirection: 'column',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, .2)',
                    display: 'flex',
                    padding: '0.25rem',
                }}
            >
                <Print>
                    {(props: RenderPrintProps) => (
                        <Button testId="print-button" onClick={props.onClick}>
                            Print
                        </Button>
                    )}
                </Print>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[printPluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
