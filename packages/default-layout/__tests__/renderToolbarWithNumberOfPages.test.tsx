import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '../src';

const TestRenderToolbar: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>
            {(toolbarSlot: ToolbarSlot) => {
                const { CurrentPageLabel, NumberOfPages } = toolbarSlot;
                return (
                    <div data-testid="current-page-label">
                        <CurrentPageLabel /> of <NumberOfPages />
                    </div>
                );
            }}
        </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });

    return (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Test renderToolbar with <NumberOfPages />', async () => {
    const { findByTestId, getByTestId } = render(<TestRenderToolbar fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 8');

    // Jump to the fourth page
    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 800,
        width: 800,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 2662,
        },
    });

    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');
    await findByTestId('core__text-layer-5');
    await findByTestId('core__annotation-layer-5');

    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4 of 8');
});
