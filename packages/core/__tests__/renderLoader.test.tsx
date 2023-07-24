import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, ProgressBar, Viewer, type PdfJsApiProvider } from '../src';

test('renderLoader option', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = () => (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '50rem', width: '50rem' }}>
                <Viewer
                    fileUrl={global['__SAMPLE_PDF__']}
                    renderLoader={(percentages) => (
                        <span data-testid="loading-progress" style={{ width: '16rem' }}>
                            <ProgressBar progress={percentages} />
                        </span>
                    )}
                />
            </div>
        </PdfJsApiContext.Provider>
    );
    const { findByTestId, getByTestId } = render(<App />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    await waitForElementToBeRemoved(() => getByTestId('loading-progress'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
});
