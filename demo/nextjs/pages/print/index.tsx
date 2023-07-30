import { Button, Viewer } from '@react-pdf-viewer/core';
import { printPlugin } from '@react-pdf-viewer/print';

const IndexPage = () => {
    const printPluginInstance = printPlugin();
    const { print } = printPluginInstance;

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
                <Button testId="print-button" onClick={print}>
                    Print
                </Button>
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
