import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'path';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { bookmarkPlugin } from '../src';

const TestCollapsedBookmarks: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

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
                    <Bookmarks />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[bookmarkPluginInstance]} />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Bookmarks are expanded initially (level 1)', async () => {
    const fileUrl = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/bookmarks-level-1.pdf')));
    const { findByTestId, getByTestId } = render(<TestCollapsedBookmarks fileUrl={fileUrl} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

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

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(32);

    const heading1 = bookmarks[5];
    expect(heading1.getAttribute('aria-label')).toEqual('1 Heading1');
    expect(heading1.getAttribute('aria-level')).toEqual('1');
    // The second and third child heading aren't displayed
    expect(heading1.textContent).toEqual('1 Heading1');

    const heading2 = bookmarks[6];
    expect(heading2.getAttribute('aria-label')).toEqual('2 Heading1-1');
    expect(heading2.getAttribute('aria-level')).toEqual('1');
    expect(heading2.textContent).toEqual('2 Heading1-1');

    const heading3 = bookmarks[7];
    expect(heading3.getAttribute('aria-label')).toEqual('3 Heading1-2');
    expect(heading3.getAttribute('aria-level')).toEqual('1');
    expect(heading3.textContent).toEqual('3 Heading1-2');
});

test('Bookmarks are expanded initially (level 2)', async () => {
    const fileUrl = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/bookmarks-level-2.pdf')));
    const { findByTestId, getByTestId } = render(<TestCollapsedBookmarks fileUrl={fileUrl} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

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

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(77);

    const heading1 = bookmarks[5];
    expect(heading1.getAttribute('aria-label')).toEqual('1 Heading1');
    expect(heading1.getAttribute('aria-level')).toEqual('1');
    // The third heading isn't displayed
    expect(heading1.textContent).toEqual('1 Heading11.1 Heading2');

    const heading2 = bookmarks[6];
    expect(heading2.getAttribute('aria-label')).toEqual('1.1 Heading2');
    expect(heading2.getAttribute('aria-level')).toEqual('2');
    expect(heading2.textContent).toEqual('1.1 Heading2');

    const heading3 = bookmarks[7];
    expect(heading3.getAttribute('aria-label')).toEqual('2 Heading1-1');
    expect(heading3.getAttribute('aria-level')).toEqual('1');
    expect(heading3.textContent).toEqual('2 Heading1-1');
});

test('Bookmarks are expanded initially (level 3)', async () => {
    const fileUrl = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/bookmarks-level-3.pdf')));
    const { findByTestId, getByTestId } = render(<TestCollapsedBookmarks fileUrl={fileUrl} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

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

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(78);

    const heading1 = bookmarks[5];
    expect(heading1.getAttribute('aria-label')).toEqual('1 Heading1');
    expect(heading1.getAttribute('aria-level')).toEqual('1');
    // The third heading is displayed
    expect(heading1.textContent).toEqual('1 Heading11.1 Heading21.1.1 Heading3');

    const heading2 = bookmarks[6];
    expect(heading2.getAttribute('aria-label')).toEqual('1.1 Heading2');
    expect(heading2.getAttribute('aria-level')).toEqual('2');
    expect(heading2.textContent).toEqual('1.1 Heading21.1.1 Heading3');

    const heading3 = bookmarks[7];
    expect(heading3.getAttribute('aria-label')).toEqual('1.1.1 Heading3');
    expect(heading3.getAttribute('aria-level')).toEqual('3');
    expect(heading3.textContent).toEqual('1.1.1 Heading3');
});
