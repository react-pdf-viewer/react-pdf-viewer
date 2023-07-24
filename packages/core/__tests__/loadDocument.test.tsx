import { render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '../src';

test('Load document successfully', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = () => (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '720px' }}>
                <Viewer fileUrl={global['__SAMPLE_PDF__']} />
            </div>
        </PdfJsApiContext.Provider>
    );
    const { findByText } = render(<App />);
    mockAllIsIntersecting(true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
