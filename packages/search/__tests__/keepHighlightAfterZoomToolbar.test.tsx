import { Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { findAllByTitle } from '@testing-library/dom';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import type { FlagKeyword } from '../src';

const TestKeepHighlight: React.FC<{
    fileUrl: Uint8Array;
    keyword: string | FlagKeyword;
}> = ({ fileUrl, keyword }) => {
    const toolbarPluginInstance = toolbarPlugin({
        searchPlugin: {
            keyword,
        },
    });
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                width: '50rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    height: '2.5rem',
                    justifyContent: 'center',
                }}
            >
                <Toolbar />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </div>
        </div>
    );
};

test('Keep highlighting after clicking zoom buttons in the default toolbar', async () => {
    const keyword = 'document';

    const { findByTestId, getByTestId } = render(
        <TestKeepHighlight fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 759;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => screen.getByTestId('core__doc-loading'));
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
        height: 759,
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
            scrollTop: 5331,
        },
    });

    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');
    await findByTestId('core__text-layer-5');
    await findByTestId('core__annotation-layer-5');

    let page = await findByTestId('core__page-layer-6');

    // Wait for the text layer to be rendered completely
    await findByTestId('core__text-layer-6');
    await findByTestId('core__annotation-layer-6');

    let highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(3);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Zoom the document
    const zoomInButton = await findByTestId('zoom__in-button');
    fireEvent.click(zoomInButton);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 3549,
        },
    });

    page = await findByTestId('core__page-layer-4');
    await findByTestId('core__text-layer-4');

    highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(8);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
