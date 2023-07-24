import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '../src';

test('initialRotation option', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = () => (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '50rem', width: '50rem' }}>
                <Viewer fileUrl={global['__SAMPLE_PDF__']} initialRotation={90} />
            </div>
        </PdfJsApiContext.Provider>
    );
    const { getByTestId, findByTestId, findByText } = render(<App />);
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    const firstPage = await findByTestId('core__page-layer-0');
    expect(parseInt(firstPage.style.width, 10)).toEqual(926);
    expect(parseInt(firstPage.style.height, 10)).toEqual(654);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
    expect(firstText.style.top).toEqual('8.87%');
    expect(firstText.style.left).toEqual('35.93%');
});
