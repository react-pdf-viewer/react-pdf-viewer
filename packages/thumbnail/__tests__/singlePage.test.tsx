import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { thumbnailPlugin } from '../src';

const TestThumbnails: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <React.StrictMode>
            <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
                <div
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        height: '50rem',
                        width: '50rem',
                        margin: '1rem auto',
                    }}
                >
                    <div
                        style={{
                            borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                            overflow: 'auto',
                            width: '15rem',
                        }}
                    >
                        <Thumbnails />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
                    </div>
                </div>
            </PdfJsApiContext.Provider>
        </React.StrictMode>
    );
};

test('Test <Thumbnails /> of a single page document', async () => {
    const { findByLabelText, findByTestId, findByText, getByTestId } = render(
        <TestThumbnails fileUrl={global['__DUMMY_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 558;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    // Check if the text is rendered
    const span = await findByText('Dummy PDF file');
    expect(span.classList.contains('rpv-core__text-layer-text')).toEqual(true);
    expect(span.style.fontSize).toEqual('');
    expect(span.style.left).toEqual('9.55%');
    expect(span.style.top).toEqual('8.56%');

    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 558,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const thumbnailsContainer = await findByTestId('thumbnail__list');
    expect(thumbnailsContainer.querySelectorAll('.rpv-thumbnail__item').length).toEqual(1);

    // Check if the thumbnail is rendered
    const firstThumbnailContainer = await findByTestId('thumbnail__container-0');
    mockIsIntersecting(firstThumbnailContainer, true);

    const firstThumbnailImage = await findByLabelText('Thumbnail of page 1');
    const src = firstThumbnailImage.getAttribute('src');
    expect(src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACNCAYAAABBqd8eAAAABmJLR0QA/wD/AP+gvaeTAAACe0lEQV',
    );
    expect(src?.length).toEqual(970);
});
