import { PrimaryButton, Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { zoomPlugin } from '../src';

const TestCallZoomMethod: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const zoomPluginInstance = zoomPlugin();
    const { zoomTo } = zoomPluginInstance;

    return (
        <>
            <div
                style={{
                    marginBottom: '16px',
                }}
            >
                <PrimaryButton onClick={() => zoomTo(1.5)}>Zoom to 150%</PrimaryButton>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[zoomPluginInstance]} />
            </div>
        </>
    );
};

test('call zoom() method', async () => {
    const { findByTestId, findByText, getByTestId } = render(
        <TestCallZoomMethod fileUrl={global['__MULTIPLE_PAGES_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 558;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => screen.getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');

    // Now zoom the document
    const zoomButton = await screen.findByText('Zoom to 150%');
    fireEvent.click(zoomButton);

    const lastPage = getByTestId('core__page-layer-1');

    // Check the page size
    expect(parseInt(lastPage.style.width, 10)).toEqual(918);
    expect(parseInt(lastPage.style.height, 10)).toEqual(1188);

    // Check font size of a given text
    const text = await findByText('Simple PDF File 2');
    expect(text).toHaveClass('rpv-core__text-layer-text');
});
