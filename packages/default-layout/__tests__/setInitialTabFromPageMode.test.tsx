import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin, setInitialTabFromPageMode } from '../src';

const TestSetInitialTabFromPageMode: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        setInitialTab: setInitialTabFromPageMode,
    });

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '50rem', width: '50rem' }}>
                <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Set the initial tab from document page mode', async () => {
    const { findByTestId, getByTestId } = render(
        <TestSetInitialTabFromPageMode fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(3);

    const heading = bookmarks[2];
    expect(heading.getAttribute('aria-label')).toEqual('Parameters for Opening PDF Files');
    expect(heading.getAttribute('aria-level')).toEqual('1');
    expect(heading.textContent).toEqual('Parameters for Opening PDF Files');
});
