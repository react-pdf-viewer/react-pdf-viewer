import { Button, PdfJsApiContext, Spinner, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { printPlugin, type RenderPrintProps } from '../src';

const TestCustomProgressBar: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
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
                    <div style={{ marginBottom: '1rem' }} data-testid={`preparing-label-${numLoadedPages}`}>
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
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
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
                    <Viewer fileUrl={fileUrl} plugins={[printPluginInstance]} />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Customize progress bar', async () => {
    const { findByTestId, getByTestId } = render(<TestCustomProgressBar fileUrl={global['__MULTIPLE_PAGES_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 757;
    viewerEle['__jsdomMockClientWidth'] = 1022;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');

    // Click the `Print` button
    const printButton = getByTestId('print-button');
    fireEvent.click(printButton);

    let preparingLabel = await findByTestId('preparing-label-0');
    expect(preparingLabel.textContent).toEqual('Preparing 0/2 pages ...');

    preparingLabel = await findByTestId('preparing-label-1');
    expect(preparingLabel.textContent).toEqual('Preparing 1/2 pages ...');
});
