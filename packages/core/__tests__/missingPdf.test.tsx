import { render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '../src';

test('Render document that does not exist', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = () => (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '720px' }}>
                <Viewer fileUrl={'file:///../../../assets/not-found.pdf'} />
            </div>
        </PdfJsApiContext.Provider>
    );
    const { findByText } = render(<App />);
    mockAllIsIntersecting(true);

    const errorMessage = await findByText('Missing PDF "/assets/not-found.pdf".');
    expect(errorMessage).toHaveClass('rpv-core__doc-error-text');
});
