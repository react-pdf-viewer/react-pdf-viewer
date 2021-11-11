import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { toolbarPlugin } from '../src';

const TestSwitchScrollMode: React.FC<{
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
                height: '100%',
            }}
        >
            <div>
                <Toolbar />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </div>
        </div>
    );
};

test('Switch scroll mode from menu items', async () => {
    const { findByLabelText, findByText, getByTestId } = render(
        <TestSwitchScrollMode fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const moreButton = await findByLabelText('More actions');
    fireEvent.click(moreButton);

    const wrappedMenuItem = await findByText('Wrapped scrolling');
    fireEvent.click(wrappedMenuItem);

    const pagesContainer = getByTestId('core__inner-pages');
    expect(pagesContainer).toHaveClass('rpv-scroll-mode__wrapped');
});
