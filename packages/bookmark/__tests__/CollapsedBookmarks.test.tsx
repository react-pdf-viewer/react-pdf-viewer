import { Viewer } from '@react-pdf-viewer/core';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { bookmarkPlugin } from '../src';

const fs = require('fs');
const path = require('path');

const TestCollapsedBookmarks: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

    return (
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
    await waitForElementToBeRemoved(() => screen.getByTestId('core__doc-loading'));
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
    expect(heading1.getAttribute('aria-label')?.localeCompare('1 Heading1')).toEqual(1);
    expect(heading1.getAttribute('aria-level')).toEqual('1');
    // The second and third child heading aren't displayed
    expect(heading1.textContent?.localeCompare('1 Heading1')).toEqual(1);

    const heading2 = bookmarks[6];
    expect(heading2.getAttribute('aria-label')?.localeCompare('2 Heading1-1')).toEqual(1);
    expect(heading2.getAttribute('aria-level')).toEqual('1');
    expect(heading2.textContent?.localeCompare('2 Heading1-1')).toEqual(1);

    const heading3 = bookmarks[7];
    expect(heading3.getAttribute('aria-label')?.localeCompare('3 Heading1-2')).toEqual(1);
    expect(heading3.getAttribute('aria-level')).toEqual('1');
    expect(heading3.textContent?.localeCompare('3 Heading1-2')).toEqual(1);
});

test('Bookmarks are expanded initially (level 2)', async () => {
    const fileUrl = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/bookmarks-level-2.pdf')));
    const { findByTestId, getByTestId } = render(<TestCollapsedBookmarks fileUrl={fileUrl} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

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

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(77);

    const heading1 = bookmarks[5];
    expect(heading1.getAttribute('aria-label')?.localeCompare('1 Heading1')).toEqual(1);
    expect(heading1.getAttribute('aria-level')).toEqual('1');
    // The third heading isn't displayed
    expect(heading1.textContent?.localeCompare('1 Heading11.1 Heading2')).toEqual(1);

    const heading2 = bookmarks[6];
    expect(heading2.getAttribute('aria-label')?.localeCompare('1.1 Heading2')).toEqual(1);
    expect(heading2.getAttribute('aria-level')).toEqual('2');
    expect(heading2.textContent?.localeCompare('1.1 Heading2')).toEqual(1);

    const heading3 = bookmarks[7];
    expect(heading3.getAttribute('aria-label')?.localeCompare('2 Heading1-1')).toEqual(1);
    expect(heading3.getAttribute('aria-level')).toEqual('1');
    expect(heading3.textContent?.localeCompare('2 Heading1-1')).toEqual(1);
});

test('Bookmarks are expanded initially (level 3)', async () => {
    const fileUrl = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/bookmarks-level-3.pdf')));
    const { findByTestId, getByTestId } = render(<TestCollapsedBookmarks fileUrl={fileUrl} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

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

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(78);

    const heading1 = bookmarks[5];
    expect(heading1.getAttribute('aria-label')?.localeCompare('1 Heading1')).toEqual(1);
    expect(heading1.getAttribute('aria-level')).toEqual('1');
    // The third heading is displayed
    expect(heading1.textContent?.localeCompare('1 Heading11.1 Heading21.1.1 Heading3')).toEqual(1);

    const heading2 = bookmarks[6];
    expect(heading2.getAttribute('aria-label')?.localeCompare('1.1 Heading2')).toEqual(1);
    expect(heading2.getAttribute('aria-level')).toEqual('2');
    expect(heading2.textContent?.localeCompare('1.1 Heading21.1.1 Heading3')).toEqual(1);

    const heading3 = bookmarks[7];
    expect(heading3.getAttribute('aria-label')?.localeCompare('1.1.1 Heading3')).toEqual(1);
    expect(heading3.getAttribute('aria-level')).toEqual('3');
    expect(heading3.textContent?.localeCompare('1.1.1 Heading3')).toEqual(1);
});
