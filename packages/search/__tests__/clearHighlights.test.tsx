import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { findAllByTitle } from '@testing-library/dom';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { searchPlugin, type SingleKeyword } from '../src';

const TestClearHighlights: React.FC<{
    fileUrl: Uint8Array;
    keywords: SingleKeyword[];
}> = ({ fileUrl, keywords }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const searchPluginInstance = searchPlugin();
    const { clearHighlights, highlight } = searchPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    display: 'flex',
                    marginBottom: '16px',
                }}
            >
                <button style={{ marginRight: '8px' }} onClick={() => highlight(keywords)}>
                    Highlight keywords
                </button>
                <button style={{ marginRight: '8px' }} onClick={() => clearHighlights()}>
                    Clear highlights
                </button>
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

test('clearHighlights() method', async () => {
    const keywords = [
        'text',
        {
            keyword: 'Boring',
            matchCase: true,
        },
    ];

    const { findByText, findByTestId, getByTestId } = render(
        <TestClearHighlights fileUrl={global['__MULTIPLE_PAGES_PDF__']} keywords={keywords} />,
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => screen.getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');

    const highlightButton = await screen.findByText('Highlight keywords');
    fireEvent.click(highlightButton);

    const page = await findByTestId('core__page-layer-1');
    await findByText('Simple PDF File 2');

    // Found 13 texts that match `PDF`
    const highlights = await findAllByTitle(page, 'text');
    expect(highlights.length).toEqual(13);

    // Click the `Clear highlights` button
    const clearButton = await screen.findByText('Clear highlights');
    fireEvent.click(clearButton);

    expect(page.querySelectorAll('.rpv-search__highlight').length).toEqual(0);
});
