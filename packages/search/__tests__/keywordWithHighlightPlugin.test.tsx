import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { highlightPlugin } from '@react-pdf-viewer/highlight';
import { findAllByTitle } from '@testing-library/dom';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { searchPlugin, type FlagKeyword } from '../src';

const TestKeywordWithHighlightPlugin: React.FC<{
    fileUrl: Uint8Array;
    keyword: string | FlagKeyword;
}> = ({ fileUrl, keyword }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const highlightPluginInstance = highlightPlugin();
    const searchPluginInstance = searchPlugin({
        keyword,
    });

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance, searchPluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('keyword option with the highlight plugin', async () => {
    const keyword = 'and';

    const { findByTestId, getByTestId } = render(
        <TestKeywordWithHighlightPlugin fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />,
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    // Jump to the second page
    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 800,
        width: 800,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 907,
        },
    });

    // There are 21 results on the second page
    let searchHighlights = await findByTestId('search__highlights-1');
    let highlights = await findAllByTitle(searchHighlights, keyword);
    expect(highlights.length).toEqual(21);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Scroll to the 4th page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 3485,
        },
    });

    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');
    await findByTestId('core__text-layer-5');
    await findByTestId('core__annotation-layer-5');
    await findByTestId('core__text-layer-6');
    await findByTestId('core__annotation-layer-6');

    // There are 8 results on the 4th page
    searchHighlights = await findByTestId('search__highlights-4');
    highlights = await findAllByTitle(searchHighlights, keyword);
    expect(highlights.length).toEqual(8);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
