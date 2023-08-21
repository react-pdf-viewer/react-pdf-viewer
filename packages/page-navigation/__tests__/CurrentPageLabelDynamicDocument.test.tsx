import { Button, PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'path';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { pageNavigationPlugin } from '../src';

const TestCurrentPageLabelDynamicDocument = () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const pageLabelDocument = React.useMemo(
        () => new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels-2.pdf'))),
        [],
    );

    const [fileUrl, setFileUrl] = React.useState<Uint8Array>();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageLabel } = pageNavigationPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                <div style={{ marginRight: '0.5rem' }}>
                    <Button onClick={() => setFileUrl(global['__OPEN_PARAMS_PDF__'])}>Load document 1</Button>
                </div>
                <Button onClick={() => setFileUrl(pageLabelDocument)}>Load document 2</Button>
            </div>

            {fileUrl && (
                <div
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '50rem',
                        width: '50rem',
                    }}
                >
                    <div
                        style={{
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            height: '2rem',
                            justifyContent: 'center',
                        }}
                    >
                        <CurrentPageLabel>
                            {(props) => (
                                <span data-testid="current-page-label">
                                    {props.currentPage + 1} of {props.numberOfPages}
                                </span>
                            )}
                        </CurrentPageLabel>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
                    </div>
                </div>
            )}
        </PdfJsApiContext.Provider>
    );
};

test('Test <CurrentPageLabel> with dynamic document', async () => {
    const { findByTestId, getByTestId, getByText } = render(<TestCurrentPageLabelDynamicDocument />);

    // Click the `Load document 1` button
    fireEvent.click(getByText('Load document 1'));

    let viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 766;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 8');

    // Jump to the fourth page
    let pagesContainer = getByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 766,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 2662,
        },
    });

    await findByTestId('core__text-layer-3');
    await findByTestId('core__text-layer-4');
    await findByTestId('core__text-layer-5');
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4 of 8');

    viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 766;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Click the `Load document 2` button
    fireEvent.click(getByText('Load document 2'));

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 8');

    // Jump to the 6th page
    pagesContainer = getByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 766,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 4445,
        },
    });

    await findByTestId('core__text-layer-3');
    await findByTestId('core__text-layer-4');
    await findByTestId('core__text-layer-5');
    pageLabel = await findByTestId('current-page-label');
    await waitFor(() => expect(pageLabel.textContent).toEqual('6 of 8'));
});
