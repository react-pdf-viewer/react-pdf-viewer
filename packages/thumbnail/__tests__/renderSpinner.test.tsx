import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { thumbnailPlugin } from '../src';

const TestRenderSpinner: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const thumbnailPluginInstance = thumbnailPlugin({
        renderSpinner: () => <div className="custom-spinner" />,
    });
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                        overflow: 'auto',
                        width: '30%',
                    }}
                >
                    <Thumbnails />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Test renderSpinner option', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestRenderSpinner fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 559;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const thumbnailsContainer = await findByTestId('thumbnail__list');
    expect(thumbnailsContainer.querySelectorAll('.custom-spinner').length).toEqual(8);

    // Make the first two thumbnail items visible
    const thumbnailItems = Array.from(thumbnailsContainer.querySelectorAll('.rpv-thumbnail__container'));
    mockIsIntersecting(thumbnailItems[0], true);
    mockIsIntersecting(thumbnailItems[1], true);

    await findByLabelText('Thumbnail of page 1');
    await findByLabelText('Thumbnail of page 2');

    // Maybe there are 5 pages whose thumbnails aren't rendered yet
    // because we will pre-render the thumbnail of page 3
    const numUnloadThumbnails = thumbnailsContainer.querySelectorAll('.custom-spinner').length;
    expect(numUnloadThumbnails === 5 || numUnloadThumbnails === 6).toBeTruthy();
});
