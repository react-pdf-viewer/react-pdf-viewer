import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { zoomPlugin } from '../src';

const TestZoomLevels: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const zoomPluginInstance = zoomPlugin();
    const { Zoom } = zoomPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                width: '50rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    borderBottom: '1px solid rgba(0, 0, 0, .3)',
                    padding: '0.25rem 0',
                    justifyContent: 'center',
                }}
            >
                <Zoom levels={[0.4, 0.8, 1.2, 1.6, 2.4, 3.2]} />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[zoomPluginInstance]} />
            </div>
        </div>
    );
};

test('Custom zoom levels with <Zoom />', async () => {
    const { findByTestId, findByText, getByRole, getByTestId } = render(
        <TestZoomLevels fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    // Zoom the document
    let zoomButton = await getByRole('button', { name: 'Zoom document' });
    fireEvent.click(zoomButton);

    const menuItem = await findByText('240%');
    expect(menuItem).toHaveClass('rpv-core__menu-item-label');
    fireEvent.click(menuItem);

    // To make sure the zooming process is done
    await findByText('Parameters for Opening PDF Files');

    const firstPage = await findByTestId('core__page-layer-0');

    // Check the page size
    expect(parseInt(firstPage.style.width, 10)).toEqual(1425);
    expect(parseInt(firstPage.style.height, 10)).toEqual(1900);
});
