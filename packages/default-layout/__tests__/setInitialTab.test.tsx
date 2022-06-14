import { Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestSetInitialTab: React.FC<{
    fileUrl: Uint8Array;
    initialTab: number;
}> = ({ fileUrl, initialTab }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        setInitialTab: () => Promise.resolve(initialTab),
    });

    return (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Set the initial tab', async () => {
    // The thumbnail tab is activated initially
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestSetInitialTab fileUrl={global['__OPEN_PARAMS_PDF__']} initialTab={0} />
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
});

test('Set invalid initial tab', async () => {
    const { findByTestId, getByTestId } = render(
        <TestSetInitialTab fileUrl={global['__OPEN_PARAMS_PDF__']} initialTab={-1} />
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

    // The thumbnail tab is empty
    let thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    expect(thumbnailsListContainer.innerHTML).toEqual('');
});
