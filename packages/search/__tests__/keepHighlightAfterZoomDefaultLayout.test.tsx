import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { findAllByTitle } from '@testing-library/dom';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import type { FlagKeyword } from '../src';

const TestKeepHighlight: React.FC<{
    fileUrl: Uint8Array;
    keyword: string | FlagKeyword;
}> = ({ fileUrl, keyword }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            searchPlugin: {
                keyword,
            },
        },
    });

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '50rem',
                width: '50rem',
            }}
        >
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Keep highlighting after zooming', async () => {
    const keyword = 'document';

    const { findByTestId, getByTestId } = render(
        <TestKeepHighlight fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

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
            scrollTop: 3549,
        },
    });

    // Wait for the text layer to be rendered completely
    let page = await findByTestId('core__page-layer-4');
    await findByTestId('core__text-layer-4');

    let highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(8);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Zoom the document
    const zoomOutButton = await findByTestId('zoom__out-button');
    fireEvent.click(zoomOutButton);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 4440,
        },
    });

    page = await findByTestId('core__page-layer-5');
    await findByTestId('core__text-layer-5');

    highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(4);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
