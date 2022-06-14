import { Viewer } from '@react-pdf-viewer/core';
import { findAllByTitle } from '@testing-library/dom';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { searchPlugin } from '../src';

const TestKeywordMultipleSpansOption: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const searchPluginInstance = searchPlugin({
        keyword,
    });

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '50rem',
                width: '50rem',
            }}
        >
            <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
        </div>
    );
};

test('keyword belongs to multiple spans', async () => {
    const keyword = 'format PDF';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordMultipleSpansOption fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

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
        height: 798,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    // Scroll to the 4th page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 2705,
        },
    });

    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');

    // Wait for the text layer to be rendered completely
    await findByTestId('core__text-layer-3');
    await findByText('Who should read this guide?');

    let searchHighlights = await findByTestId('search__highlights-3');
    const highlights = await findAllByTitle(searchHighlights, keyword);
    expect(highlights.length).toEqual(2);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
