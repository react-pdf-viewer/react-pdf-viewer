import React from 'react';
import Viewer, { RenderPage, RenderPageProps } from '@phuocng/react-pdf-viewer';

const WaterMarkExample: React.FC<{}> = () => {
    const renderPage: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }
            }>
                <div
                    style={{
                        color: 'rgba(0, 0, 0, 0.2)',
                        fontSize: `${8 * props.scale}rem`,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        transform: 'rotate(-45deg)',
                        userSelect: 'none',
                    }}
                >
                    Draft
                </div>
            </div>
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    );

    return (
        <div style={{ height: '750px', padding: '16px 0' }}>
            <Viewer
                fileUrl="/pdf-open-parameters.pdf"
                renderPage={renderPage}
            />
        </div>
    );
};

export default WaterMarkExample;
