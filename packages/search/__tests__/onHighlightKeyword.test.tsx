import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { searchPlugin, type OnHighlightKeyword } from '../src';

const TestOnHighlightKeywordOption: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const searchPluginInstance = searchPlugin({
        keyword,
        onHighlightKeyword: (props: OnHighlightKeyword) => {
            if (props.keyword.source === keyword) {
                props.highlightEle.classList.add('custom-highlight');
            }
        },
    });

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '720px',
                    width: '720px',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('onHighlightKeyword option', async () => {
    const keyword = 'text';

    const { findByText, findByTestId, getByTestId } = render(
        <TestOnHighlightKeywordOption fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={keyword} />,
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-1');
    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights[0]).toHaveClass('custom-highlight');
});
