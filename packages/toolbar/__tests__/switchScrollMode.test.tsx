import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
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
                height: '50rem',
                width: '50rem',
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
    const { findByLabelText, findByText, findByTestId, getByTestId } = render(
        <TestSwitchScrollMode fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 767;
    viewerEle['__jsdomMockClientWidth'] = 800;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    const moreButton = await findByLabelText('More actions');
    fireEvent.click(moreButton);

    const horizontalMenuItem = await findByText('Horizontal scrolling');
    fireEvent.click(horizontalMenuItem);

    const pagesContainer = await findByTestId('core__inner-pages');
    expect(pagesContainer).toHaveClass('rpv-core__inner-pages--horizontal');
});
