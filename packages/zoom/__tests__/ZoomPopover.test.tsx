import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { zoomPlugin } from '../src';

const TestZoomPopoverLevels: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const zoomPluginInstance = zoomPlugin();
    const { ZoomPopover } = zoomPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '720px',
                    width: '640px',
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
                    <ZoomPopover levels={[0.4, 0.8, 1.2, 1.6, 2.4, 3.2]} />
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
        </PdfJsApiContext.Provider>
    );
};

test('Custom zoom levels with <ZoomPopover />', async () => {
    const { findByTestId, findByText, getByRole, getByTestId } = render(
        <TestZoomPopoverLevels fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 720;
    viewerEle['__jsdomMockClientWidth'] = 640;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    // Zoom the document
    const zoomButton = getByRole('button', { name: 'Zoom document' });
    fireEvent.click(zoomButton);

    const menuItem = await findByText('80%');
    expect(menuItem).toHaveClass('rpv-core__menu-item-label');
    fireEvent.click(menuItem);

    // To make sure the zooming process is done
    await findByText('Parameters for Opening PDF Files');

    const firstPage = await findByTestId('core__page-layer-0');

    // Check the page size
    expect(parseInt(firstPage.style.width, 10)).toEqual(475);
    expect(parseInt(firstPage.style.height, 10)).toEqual(633);
});
