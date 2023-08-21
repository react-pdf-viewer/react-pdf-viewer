import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { findAllByTitle, getAllByTitle, queryAllByTitle, waitForElementToBeRemoved } from '@testing-library/dom';
import { fireEvent, render, screen } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { searchPlugin, type SingleKeyword } from '../src';

const TestSetTargetPages: React.FC<{
    fileUrl: Uint8Array;
    keywords: SingleKeyword[];
}> = ({ fileUrl, keywords }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const searchPluginInstance = searchPlugin();
    const { highlight, setTargetPages } = searchPluginInstance;

    // Only search in the second page
    setTargetPages((targetPage) => targetPage.pageIndex === 1);

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

test('setTargetPages() method', async () => {
    const keywords = [
        'text',
        {
            keyword: 'Boring',
            matchCase: true,
        },
    ];

    const { findByText, findByTestId, getByTestId } = render(
        <TestSetTargetPages fileUrl={global['__MULTIPLE_PAGES_PDF__']} keywords={keywords} />,
    );
    const viewerEle = getByTestId('core__viewer');
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;
    mockIsIntersecting(viewerEle, true);

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');

    const highlightButton = await screen.findByText('Highlight keywords');
    fireEvent.click(highlightButton);

    // There is no result on the first page because we ignore it
    await findByText('A Simple PDF File');

    let searchHighlights = await findByTestId('search__highlights-0');
    let highlights = queryAllByTitle(searchHighlights, 'text');
    expect(highlights.length).toEqual(0);

    // Search on the second page
    await findByText('Simple PDF File 2');

    // Found 13 texts that match `text`
    searchHighlights = await findByTestId('search__highlights-1');
    highlights = await findAllByTitle(searchHighlights, 'text');
    expect(highlights.length).toEqual(13);
    expect(highlights[0].getAttribute('title')).toEqual('text');
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Found 1 text that match `Boring`
    highlights = getAllByTitle(searchHighlights, 'Boring');
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual('Boring');
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    expect(searchHighlights.querySelectorAll('.rpv-search__highlight[title="text"]').length).toEqual(13);
});
