import { PrimaryButton, RotateDirection, Viewer } from '@react-pdf-viewer/core';
import { rotatePlugin } from '@react-pdf-viewer/rotate';

const IndexPage = () => {
    const rotatePluginInstance = rotatePlugin();
    const { RotatePage } = rotatePluginInstance;

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
                    <RotatePage>
                        {(props) => (
                            <PrimaryButton
                                testId="rotate-forward"
                                onClick={() => props.onRotatePage(0, RotateDirection.Forward)}
                            >
                                Rotate the first page forward
                            </PrimaryButton>
                        )}
                    </RotatePage>
                </div>
                <div style={{ padding: '0 0.25rem' }}>
                    <RotatePage>
                        {(props) => (
                            <PrimaryButton
                                testId="rotate-backward"
                                onClick={() => props.onRotatePage(0, RotateDirection.Backward)}
                            >
                                Rotate the first page backward
                            </PrimaryButton>
                        )}
                    </RotatePage>
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer defaultScale={0.5} fileUrl="/pdf-open-parameters.pdf" plugins={[rotatePluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
