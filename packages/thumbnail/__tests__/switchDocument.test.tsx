import { Button, PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'path';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { thumbnailPlugin } from '../src';

const TestSwitchDocument = () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const secondDocument = React.useMemo(
        () => new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/sample-2.pdf'))),
        [],
    );

    const [fileUrl, setFileUrl] = React.useState(global['__OPEN_PARAMS_PDF__']);
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <React.StrictMode>
            <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
                <div
                    style={{
                        margin: '1rem auto',
                        width: '64rem',
                    }}
                >
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            marginBottom: '1rem',
                        }}
                    >
                        <div style={{ marginRight: '0.5rem' }}>
                            <Button testId="load-doc-1" onClick={() => setFileUrl(global['__OPEN_PARAMS_PDF__'])}>
                                Load document 1
                            </Button>
                        </div>
                        <Button testId="load-doc-2" onClick={() => setFileUrl(secondDocument)}>
                            Load document 2
                        </Button>
                    </div>
                    <div
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            height: '50rem',
                            width: '50rem',
                        }}
                    >
                        <div
                            style={{
                                alignItems: 'center',
                                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                padding: '0.25rem',
                                width: '20%',
                            }}
                        >
                            <Thumbnails />
                        </div>
                        <div
                            style={{
                                flex: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
                        </div>
                    </div>
                </div>
            </PdfJsApiContext.Provider>
        </React.StrictMode>
    );
};

test('Thumbnails are updated when switching between documents', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(<TestSwitchDocument />);

    let viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 631;
    viewerEle['__jsdomMockClientWidth'] = 800;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__canvas-layer-0');
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__canvas-layer-1');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__canvas-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__canvas-layer-3');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    const getSourceOfFirstThumbnail = async () => {
        const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
        mockIsIntersecting(thumbnailsListContainer, true);

        const thumbnailsContainer = await findByTestId('thumbnail__list');
        // Make the first thumbnail item visible
        const thumbnailItems = Array.from(thumbnailsContainer.querySelectorAll('.rpv-thumbnail__container'));
        mockIsIntersecting(thumbnailItems[0], true);

        const firstThumbnail = await findByLabelText('Thumbnail of page 1');
        return firstThumbnail.getAttribute('src');
    };

    let src = await getSourceOfFirstThumbnail();
    expect(src?.slice(-100)).toEqual(
        'g5q5u9+1tNDZs+y0tLZiUW7cJm7ZQhRFYcdbf7xnA1vITNN8XeAtW4h0f8mDumBkEMHIIIL5Hw+y6qIMqKXCAAAAAElFTkSuQmCC',
    );
    expect(src?.length).toEqual(3662);

    viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 631;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Load the second document
    const loadSecondDoc = await findByTestId('load-doc-2');
    fireEvent.click(loadSecondDoc);

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__canvas-layer-0');
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    src = await getSourceOfFirstThumbnail();
    expect(src?.slice(-100)).toEqual(
        '5PuuE+APbyzyd7/y/Lt6z597+Cw/e+H+bfd9hrzH6L3nB/9TTu8z5D1G7zPkPUbvM+Q9Rv8f7w4oIdTXLq4AAAAASUVORK5CYII=',
    );
    expect(src?.length).toEqual(19974);
});
