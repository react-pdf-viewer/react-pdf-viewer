import { Viewer } from '@react-pdf-viewer/core';
import { findAllByTitle } from '@testing-library/dom';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { searchPlugin } from '../src';
import type { FlagKeyword } from '../src';

const TestKeywordOption: React.FC<{
    fileUrl: Uint8Array;
    keyword: string | FlagKeyword;
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

test('keyword option', async () => {
    const keyword = 'text';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={keyword} />
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

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(13);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('Special character in the keyword', async () => {
    const keyword = '(a';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />
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

    // Jump to the fourth page
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

    const page = await findByTestId('core__page-layer-4');
    await findByText('Parameters for Opening PDF Files');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('Match case of special character', async () => {
    const flagKeyword = {
        keyword: '(A',
        matchCase: true,
    };

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={flagKeyword} />
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

    // Jump to the fourth page
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
            scrollTop: 4436,
        },
    });

    const page = await findByTestId('core__page-layer-5');
    await findByText('Adobe Acrobat SDK');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
