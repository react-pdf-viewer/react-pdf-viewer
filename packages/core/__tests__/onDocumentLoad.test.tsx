import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import type { DocumentLoadEvent } from '../src';
import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '../src';

const TestOnDocumentLoad: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const [numPages, setNumPages] = React.useState(0);
    const [fileLength, setFileLength] = React.useState(0);

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setNumPages(e.doc.numPages);
        setFileLength(e.file.data.length);
    };

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div data-testid="file-length">{fileLength}</div>
            <div data-testid="num-pages">{numPages}</div>
            <div style={{ height: '50rem', width: '50rem' }}>
                <Viewer fileUrl={fileUrl} onDocumentLoad={handleDocumentLoad} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('onDocumentLoad() callback', async () => {
    const { findByTestId, getByTestId } = render(<TestOnDocumentLoad fileUrl={global['__MULTIPLE_PAGES_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');

    const numPagesLabel = await findByTestId('num-pages');
    expect(numPagesLabel.textContent).toEqual('2');

    const fileLengthLabel = await findByTestId('file-length');
    expect(fileLengthLabel.innerHTML).toEqual('3028');
});
