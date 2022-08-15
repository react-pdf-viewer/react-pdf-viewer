import { Button, Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestToggleTab: React.FC<{
    fileUrl: Uint8Array;
    initialTab: number;
}> = ({ fileUrl, initialTab }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const { toggleTab } = defaultLayoutPluginInstance;

    return (
        <div
            style={{
                margin: '1rem auto',
                width: '50rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    marginBottom: '1rem',
                }}
            >
                <div style={{ marginRight: '0.5rem' }}>
                    <Button testId="toggle-thumbnail-tab" onClick={() => toggleTab(0)}>
                        Toggle thumbnail tab
                    </Button>
                </div>
                <div style={{ marginRight: '0.5rem' }}>
                    <Button testId="toggle-bookmark-tab" onClick={() => toggleTab(1)}>
                        Toggle bookmark tab
                    </Button>
                </div>
                <Button testId="toggle-attachment-tab" onClick={() => toggleTab(2)}>
                    Toggle attachment tab
                </Button>
            </div>
            <div style={{ height: '50rem' }}>
                <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
            </div>
        </div>
    );
};

test('Toggle a tab', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestToggleTab fileUrl={global['__OPEN_PARAMS_PDF__']} initialTab={0} />
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

    const toggleThumbnailTab = await findByTestId('toggle-thumbnail-tab');
    const toggleBookmarkTab = await findByTestId('toggle-bookmark-tab');
    const toggleAttachmentTab = await findByTestId('toggle-attachment-tab');

    // Toggle the thumbnail tab
    fireEvent.click(toggleThumbnailTab);

    let thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);
    let thumbnailsContainer = await findByTestId('thumbnail__list');
    expect(thumbnailsContainer.childElementCount).toEqual(8);

    // Toggle the bookmark tab
    fireEvent.click(toggleBookmarkTab);

    let bookmarksContainer = await findByTestId('bookmark__container');
    let bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(3);

    // Toggle the attachment tab
    fireEvent.click(toggleAttachmentTab);

    let attachmentContainer = await findByTestId('attachment__empty');
    expect(attachmentContainer.textContent).toEqual('There is no attachment');

    // Toggle the bookmark tab again
    fireEvent.click(toggleBookmarkTab);

    bookmarksContainer = await findByTestId('bookmark__container');
    bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(3);
});
