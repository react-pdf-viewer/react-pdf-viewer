import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { findAllByTitle, getAllByTitle } from '@testing-library/dom';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { searchPlugin, type SingleKeyword } from '../src';

const TestHighlight: React.FC<{
    fileUrl: Uint8Array;
    keywords: SingleKeyword[];
}> = ({ fileUrl, keywords }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const searchPluginInstance = searchPlugin();
    const { highlight } = searchPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ marginRight: '8px' }}>
                <button onClick={() => highlight(keywords)}>Highlight keywords</button>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('highlight() method', async () => {
    const keywords = [
        'text',
        {
            keyword: 'Boring',
            matchCase: true,
        },
    ];

    const { findByText, findByTestId, getByTestId } = render(
        <TestHighlight fileUrl={global['__MULTIPLE_PAGES_PDF__']} keywords={keywords} />,
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');

    const highlightButton = await findByText('Highlight keywords');
    fireEvent.click(highlightButton);

    const page = await findByTestId('core__page-layer-1');
    await findByText('Simple PDF File 2');

    // Found 13 texts that match `text`
    let highlights = await findAllByTitle(page, 'text');
    expect(highlights.length).toEqual(13);
    expect(highlights[0].getAttribute('title')).toEqual('text');
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Found 1 text that match `Boring`
    highlights = getAllByTitle(page, 'Boring');
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual('Boring');
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    expect(page.querySelectorAll('.rpv-search__highlight[title="text"]').length).toEqual(13);
});
