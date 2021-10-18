import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';

import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';

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
                height: '720px',
                width: '640px',
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
    mockAllIsIntersecting(true);

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
