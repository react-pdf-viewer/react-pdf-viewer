import { render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, TextDirection, Viewer, type PdfJsApiProvider } from '../src';

const TestRtl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '720px', width: '720px' }}>
                <Viewer
                    fileUrl={fileUrl}
                    theme={{
                        direction: TextDirection.RightToLeft,
                    }}
                />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Support RTL', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__SAMPLE_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const pagesContainer = await findByTestId('core__inner-pages');
    expect(pagesContainer).toHaveClass('rpv-core__inner-pages--rtl');
});
