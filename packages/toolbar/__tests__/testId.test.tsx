import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { toolbarPlugin } from '../src';

const TestTestIdAttribute: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const toolbarPluginInstance = toolbarPlugin();
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
            <div>
                <Toolbar />
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </div>
        </div>
    );
};

test('Test data-testid attribute', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestTestIdAttribute fileUrl={global['__SAMPLE_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');

    const searchButton = await findByLabelText('Search');
    expect(searchButton).toHaveAttribute('data-testid', 'search__popover-button');

    const previousPageButton = await findByLabelText('Previous page');
    expect(previousPageButton).toHaveAttribute('data-testid', 'page-navigation__previous-button');

    const nextPageButton = await findByLabelText('Next page');
    expect(nextPageButton).toHaveAttribute('data-testid', 'page-navigation__next-button');

    const zoomOutButton = await findByLabelText('Zoom out');
    expect(zoomOutButton).toHaveAttribute('data-testid', 'zoom__out-button');

    const zoomPopoverTarget = await findByLabelText('Zoom document');
    expect(zoomPopoverTarget).toHaveAttribute('data-testid', 'zoom__popover-target');

    const zoomInButton = await findByLabelText('Zoom in');
    expect(zoomInButton).toHaveAttribute('data-testid', 'zoom__in-button');

    const switchThemeButton = await findByLabelText('Switch to the dark theme');
    expect(switchThemeButton).toHaveAttribute('data-testid', 'theme__switch-button');

    const fullScreenButton = await findByLabelText('Full screen');
    expect(fullScreenButton).toHaveAttribute('data-testid', 'full-screen__enter-button');

    const openButton = await findByLabelText('Open file');
    expect(openButton).toHaveAttribute('data-testid', 'open__button');

    const downloadButton = await findByLabelText('Download');
    expect(downloadButton).toHaveAttribute('data-testid', 'get-file__download-button');

    const printButton = await findByLabelText('Print');
    expect(printButton).toHaveAttribute('data-testid', 'print__button');

    const moreActionsButton = await findByLabelText('More actions');
    expect(moreActionsButton).toHaveAttribute('data-testid', 'toolbar__more-actions-popover-target');

    // Open the More actions popover
    fireEvent.click(moreActionsButton);

    const firstPageMenu = await findByTestId('page-navigation__first-menu');
    expect(firstPageMenu).toHaveTextContent('First page');

    const lastPageMenu = await findByTestId('page-navigation__last-menu');
    expect(lastPageMenu).toHaveTextContent('Last page');

    const previousPageMenu = await findByTestId('page-navigation__previous-menu');
    expect(previousPageMenu).toHaveTextContent('Previous page');

    const nextPageMenu = await findByTestId('page-navigation__next-menu');
    expect(nextPageMenu).toHaveTextContent('Next page');

    const rotateClockwiseMenu = await findByTestId('rotate__forward-menu');
    expect(rotateClockwiseMenu).toHaveTextContent('Rotate clockwise');

    const rotateCounterClockwiseMenu = await findByTestId('rotate__backward-menu');
    expect(rotateCounterClockwiseMenu).toHaveTextContent('Rotate counterclockwise');

    const textSelectionModeMenu = await findByTestId('selection-mode__text-menu');
    expect(textSelectionModeMenu).toHaveTextContent('Text selection tool');

    const handSelectionModeMenu = await findByTestId('selection-mode__hand-menu');
    expect(handSelectionModeMenu).toHaveTextContent('Hand tool');

    const verticalScrollModeMenu = await findByTestId('scroll-mode__vertical-menu');
    expect(verticalScrollModeMenu).toHaveTextContent('Vertical scrolling');

    const horizontalScrollModeMenu = await findByTestId('scroll-mode__horizontal-menu');
    expect(horizontalScrollModeMenu).toHaveTextContent('Horizontal scrolling');

    const wrappedScrollModeMenu = await findByTestId('scroll-mode__wrapped-menu');
    expect(wrappedScrollModeMenu).toHaveTextContent('Wrapped scrolling');

    const propertiesMenu = await findByTestId('properties__menu');
    expect(propertiesMenu).toHaveTextContent('Show properties');
});
