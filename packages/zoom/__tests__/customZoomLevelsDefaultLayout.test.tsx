import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';

const TestZoomLevelsWithDefaultLayout: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar: (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
            <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
        ),
    });

    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
        const { Zoom } = slot;
        return Object.assign({}, slot, {
            Zoom: () => <Zoom levels={[0.4, 0.8, 1.2, 1.6, 2.4, 3.2]} />,
        });
    };

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

test('Custom zoom levels with the default layout', async () => {
    const { findByTestId, findByText, getByRole, getByTestId } = render(
        <TestZoomLevelsWithDefaultLayout fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 759;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

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

    const firstPage = await findByTestId('core__page-layer-0');

    // Zoom the document
    let zoomButton = await getByRole('button', { name: 'Zoom document' });
    fireEvent.click(zoomButton);

    const menuItem = await findByText('320%');
    expect(menuItem).toHaveClass('rpv-core__menu-item-label');
    fireEvent.click(menuItem);

    // To make sure the zooming process is done
    await findByText('Parameters for Opening PDF Files');

    // Check the page size
    expect(parseInt(firstPage.style.width, 10)).toEqual(1900);
    expect(parseInt(firstPage.style.height, 10)).toEqual(2534);
});
