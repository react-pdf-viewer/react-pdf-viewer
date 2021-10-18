import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PrimaryButton, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { zoomPlugin } from '../src/index';

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
                    height: '720px',
                    width: '640px',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[zoomPluginInstance]} />
            </div>
        </>
    );
};

test('call zoom() method', async () => {
    const { findByText, getByTestId } = render(<TestCallZoomMethod fileUrl={global['__MULTIPLE_PAGES_PDF__']} />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    // Now zoom the document
    const zoomButton = await screen.findByText('Zoom to 150%');
    fireEvent.click(zoomButton);

    const lastPage = getByTestId('core__page-layer-1');

    // Set the last page as visible
    mockIsIntersecting(lastPage, true);

    // Check the page size
    expect(parseInt(lastPage.style.width, 10)).toEqual(918);
    expect(parseInt(lastPage.style.height, 10)).toEqual(1188);

    // Check font size of a given text
    const text = await findByText('Simple PDF File 2');
    expect(text).toHaveClass('rpv-core__text-layer-text');
});
