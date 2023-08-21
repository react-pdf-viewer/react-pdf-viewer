import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { findAllByTitle } from '@testing-library/dom';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { searchPlugin, type FlagKeyword } from '../src';

const TestKeywordFlag: React.FC<{
    fileUrl: Uint8Array;
    keyword: FlagKeyword;
}> = ({ fileUrl, keyword }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
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
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('keyword with flag matchCase=false', async () => {
    const flagKeyword = {
        keyword: 'more text',
    };

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordFlag fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={flagKeyword} />,
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-1');
    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(12);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('keyword with flag matchCase=true', async () => {
    const flagKeyword = {
        keyword: 'More',
        matchCase: true,
    };

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordFlag fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={flagKeyword} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');

    const page = await findByTestId('core__page-layer-1');
    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
