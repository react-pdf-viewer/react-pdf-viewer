import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { searchPlugin, type RenderHighlightsProps } from '../src';

const TestRenderHighlight: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const searchPluginInstance = searchPlugin({
        keyword,
        renderHighlights: (renderProps: RenderHighlightsProps) => (
            <>
                {renderProps.highlightAreas.map((area, index) => (
                    <div
                        className="rpv-search__highlight custom-highlight"
                        data-index={index}
                        key={index}
                        style={renderProps.getCssProperties(area)}
                        title={area.keywordStr.trim()}
                    />
                ))}
            </>
        ),
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

test('Customize highlight elements', async () => {
    const keyword = 'text';

    const { findByText, findByTestId, getByTestId } = render(
        <TestRenderHighlight fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={keyword} />,
    );
    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-1');

    const searchHighlights = await findByTestId('search__highlights-1');
    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(searchHighlights, keyword);
    expect(highlights.length).toEqual(13);
    expect(highlights[0]).toHaveClass('custom-highlight');
});
