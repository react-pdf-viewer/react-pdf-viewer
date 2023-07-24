import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { defaultLayoutPlugin } from '../src';

const TestNavigateLastPage: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    display: 'flex',
                    height: '50rem',
                    width: '64rem',
                }}
            >
                <Viewer fileUrl={fileUrl} defaultScale={0.75} plugins={[defaultLayoutPluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Naivgate to the last page', async () => {
    const { findByTestId, getByTestId } = render(<TestNavigateLastPage fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 1024;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    // Scroll to the last page
    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 758,
        width: 977,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 8316,
        },
    });

    await findByTestId('core__text-layer-6');
    await findByTestId('core__annotation-layer-6');
    await findByTestId('core__text-layer-7');
    await findByTestId('core__annotation-layer-7');

    const pageInput = (await findByTestId('page-navigation__current-page-input')) as HTMLInputElement;
    expect(pageInput.value).toEqual('8');
});
