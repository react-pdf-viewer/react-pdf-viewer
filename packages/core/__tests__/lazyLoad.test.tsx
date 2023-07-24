import { render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '../src';

test('Lazy load', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = () => (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '720px' }}>
                <Viewer fileUrl={global['__SAMPLE_PDF__']} />
            </div>
        </PdfJsApiContext.Provider>
    );
    const { findByText, getByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
