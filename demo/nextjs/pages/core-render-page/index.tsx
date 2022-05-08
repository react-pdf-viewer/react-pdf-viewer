import type { RenderPageProps } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import * as React from 'react';

const CustomPageRender: React.FC<{
    renderPageProps: RenderPageProps;
}> = ({ renderPageProps }) => {
    React.useLayoutEffect(() => {
        // Mark that the page is rendered completely
        // So the next page in the queue will be rendered
        // Since our custom page uses the canvas layer, we have to check `renderPageProps.canvasLayerRendered`
        if (renderPageProps.canvasLayerRendered) {
            renderPageProps.markRendered(renderPageProps.pageIndex);
        }
    }, [renderPageProps.canvasLayerRendered]);

    return (
        <>
            {renderPageProps.canvasLayer.children}
            <div
                data-testid={`custom-page-${renderPageProps.pageIndex}`}
                style={{
                    // Absolute position
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    // Full size
                    height: '100%',
                    width: '100%',
                    // Center
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    // Misc
                    color: 'rgba(0, 0, 0, .3)',
                    fontSize: '2rem',
                    fontWeight: '600',
                    zIndex: 1,
                }}
            >
                Page {renderPageProps.pageIndex + 1}
            </div>
        </>
    );
};

const IndexPage = () => (
    <div
        style={{
            border: '1px solid rgba(0, 0, 0, .3)',
            display: 'flex',
            height: '50rem',
            margin: '5rem auto',
            width: '64rem',
        }}
    >
        <Viewer
            fileUrl="/pdf-open-parameters.pdf"
            renderPage={(props) => <CustomPageRender renderPageProps={props} />}
        />
    </div>
);

export default IndexPage;
