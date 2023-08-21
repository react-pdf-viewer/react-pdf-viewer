import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { thumbnailPlugin } from '../src';

const TestThumbnailWidth: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const thumbnailPluginInstance = thumbnailPlugin({
        thumbnailWidth: 150,
    });
    const { Thumbnails } = thumbnailPluginInstance;

    return (
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
    );
};

test('Test thumbnailWidth option', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestThumbnailWidth fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 558;
    viewerEle['__jsdomMockClientWidth'] = 798;

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
    expect(thumbnailsContainer.querySelectorAll('.rpv-thumbnail__item').length).toEqual(8);

    // Find the first thumbnail
    const firstThumbnailContainer = await findByTestId('thumbnail__container-0');
    mockIsIntersecting(firstThumbnailContainer, true);

    const firstThumbnailImage = await findByLabelText('Thumbnail of page 1');
    let src = firstThumbnailImage.getAttribute('src');
    expect(src?.slice(-100)).toEqual(
        '22YLv+E21w1r9JgxV/1eSYivjBo96rrXX/djM0J8W7I7EkpIWEIJCUsoIWEJJSQsoYSEJZT4P6H2Uzo/EGifAAAAAElFTkSuQmCC',
    );
    expect(src?.length).toEqual(6458);
    expect(firstThumbnailImage.getAttribute('width')).toEqual('150px');
    expect(firstThumbnailImage.getAttribute('height')).toEqual('200px');

    // Wait until the second thumbnail is rendered
    const secondThumbnailContainer = await findByTestId('thumbnail__container-1');
    mockIsIntersecting(secondThumbnailContainer, true);

    const secondThumbnailImage = await findByLabelText('Thumbnail of page 2');
    src = secondThumbnailImage.getAttribute('src');
    expect(src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQV',
    );
    expect(src?.length).toEqual(25166);
    expect(secondThumbnailImage.getAttribute('width')).toEqual('150px');
    expect(secondThumbnailImage.getAttribute('height')).toEqual('200px');
});
