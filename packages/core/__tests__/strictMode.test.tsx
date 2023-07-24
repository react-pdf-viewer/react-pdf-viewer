import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, TextDirection, Viewer, type PdfJsApiProvider } from '../src';

const TestStrictMode: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    return (
        <React.StrictMode>
            <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
                <div style={{ height: '50rem', width: '50rem' }}>
                    <Viewer
                        fileUrl={fileUrl}
                        theme={{
                            direction: TextDirection.RightToLeft,
                        }}
                    />
                </div>
            </PdfJsApiContext.Provider>
        </React.StrictMode>
    );
};

test('Support Strict mode', async () => {
    const { findByTestId, findByText, getByTestId } = render(<TestStrictMode fileUrl={global['__SAMPLE_PDF__']} />);

    const rootEle = getByTestId('core__viewer');
    mockIsIntersecting(rootEle, true);
    rootEle['__jsdomMockClientHeight'] = 800;
    rootEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    const span = await findByText('Adobe Acrobat PDF Files');
    expect(span.classList.contains('rpv-core__text-layer-text')).toEqual(true);
    expect(span.style.fontSize).toEqual('');
    expect(span.style.left).toEqual('35.93%');
    expect(span.style.top).toEqual('8.87%');
});
