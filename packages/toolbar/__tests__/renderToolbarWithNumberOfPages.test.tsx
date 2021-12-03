import * as React from 'react';
import { render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { toolbarPlugin, ToolbarSlot } from '../src';

const TestRenderToolbar: React.FC<{
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

test('Test renderToolbar with <NumberOfPages />', async () => {
    const { findByTestId, getByTestId } = render(<TestRenderToolbar fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 8');

    // Jump to the fourth page
    const page = await findByTestId('core__page-layer-3');
    mockIsIntersecting(page, true);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4 of 8');
});
