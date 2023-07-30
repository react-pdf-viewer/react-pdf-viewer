import { Viewer } from '@react-pdf-viewer/core';
import { rotatePlugin } from '@react-pdf-viewer/rotate';

const IndexPage = () => {
    const rotatePluginInstance = rotatePlugin();
    const { RotateBackwardButton, RotateForwardButton } = rotatePluginInstance;

    return (
        <div
            data-testid="root"
            className="rpv-core__viewer"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
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
                    justifyContent: 'center',
                    padding: '4px',
                }}
            >
                <div style={{ padding: '0 0.25rem' }}>
                    <RotateForwardButton />
                </div>
                <div style={{ padding: '0 0.25rem' }}>
                    <RotateBackwardButton />
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer defaultScale={0.75} fileUrl="/pdf-open-parameters.pdf" plugins={[rotatePluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
