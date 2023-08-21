import { PdfJsApiContext, TextDirection, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestRemoveSidebar: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => [],
    });

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '720px', width: '720px' }}>
                <Viewer
                    fileUrl={fileUrl}
                    theme={{
                        direction: TextDirection.RightToLeft,
                    }}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Remove the sidebar', async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(
        <TestRemoveSidebar fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 720;
    viewerEle['__jsdomMockClientWidth'] = 720;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    await findByTestId('default-layout__main');

    const sidebar = queryByTestId('default-layout__sidebar');
    expect(sidebar).toBeNull();
});
