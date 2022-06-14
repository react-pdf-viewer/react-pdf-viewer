import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestThumbnails: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Thumbnails are not displayed when switching between tabs', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestThumbnails fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    // Click the `Thumbnail` tab
    const thumbnailTab = await findByLabelText('Thumbnail');
    fireEvent.click(thumbnailTab);

    let thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);
    let thumbnailsContainer = await findByTestId('thumbnail__list');

    // Make the first thumbnail item visible
    let thumbnailItems = Array.from(thumbnailsContainer.querySelectorAll('.rpv-thumbnail__container'));
    mockIsIntersecting(thumbnailItems[0], true);

    let firstThumbnail = await findByLabelText('Thumbnail of page 1');
    let firstThumbnailSrc = firstThumbnail.getAttribute('src');
    expect(firstThumbnailSrc?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAABmJLR0QA/wD/AP+gvaeTAAAKX0lEQV'
    );
    expect(firstThumbnailSrc?.length).toEqual(3662);

    // Click the `Bookmark` tab
    const bookmarkTab = await findByLabelText('Bookmark');
    fireEvent.click(bookmarkTab);

    // Wait until the bookmarks are rendered
    await findByTestId('bookmark__container');

    // Now click the `Thumbnail` tab again
    fireEvent.click(thumbnailTab);

    thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);
    thumbnailsContainer = await findByTestId('thumbnail__list');

    thumbnailItems = Array.from(thumbnailsContainer.querySelectorAll('.rpv-thumbnail__container'));
    mockIsIntersecting(thumbnailItems[0], true);

    firstThumbnail = await findByLabelText('Thumbnail of page 1');
    firstThumbnailSrc = firstThumbnail.getAttribute('src');
    expect(firstThumbnailSrc?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACFCAYAAACt+l1zAAAABmJLR0QA/wD/AP+gvaeTAAAKX0lEQV'
    );
    expect(firstThumbnailSrc?.length).toEqual(3662);
});
