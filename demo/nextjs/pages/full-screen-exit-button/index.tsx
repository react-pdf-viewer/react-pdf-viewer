import { Button, Viewer } from '@react-pdf-viewer/core';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import * as React from 'react';

const IndexPage = () => {
    const fullScreenPluginInstance = fullScreenPlugin({
        renderExitFullScreenButton: (props) => (
            <div
                style={{
                    bottom: '1rem',
                    position: 'fixed',
                    right: '1rem',
                }}
            >
                <Button testId="exit-full-screen" onClick={props.onClick}>
                    Exit
                </Button>
            </div>
        ),
    });
    const { EnterFullScreenButton } = fullScreenPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    padding: '4px',
                }}
            >
                <EnterFullScreenButton />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[fullScreenPluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
