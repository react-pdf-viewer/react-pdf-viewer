import * as React from 'react';
import { render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
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
                height: '100%',
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

    const numPagesLabel = await findByTestId('num-pages');
    expect(numPagesLabel.textContent).toEqual('of 8');
});
