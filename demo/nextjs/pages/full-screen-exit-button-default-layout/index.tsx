import { Button, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import * as React from 'react';

const IndexPage = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            fullScreenPlugin: {
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
            },
        },
    });

    return (
        <div
            style={{
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

export default IndexPage;
