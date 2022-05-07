import { Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { toolbarPlugin, ToolbarSlot, TransformToolbarSlot } from '../src';

const TestRenderDefaultToolbar: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
        const { NumberOfPages } = slot;
        return Object.assign({}, slot, {
            NumberOfPages: () => (
                <span data-testid="num-pages">
                    of <NumberOfPages />
                </span>
            ),
        });
    };

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
                <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </div>
        </div>
    );
};

test('Custom <NumberOfPages />', async () => {
    const { findByTestId, getByTestId } = render(<TestRenderDefaultToolbar fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 798,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    const numPagesLabel = await findByTestId('num-pages');
    expect(numPagesLabel.textContent).toEqual('of 8');
});
