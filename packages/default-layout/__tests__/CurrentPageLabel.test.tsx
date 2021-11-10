import * as React from 'react';
import { render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';
import type { ToolbarProps, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const fs = require('fs');
const path = require('path');

const TestCurrentPageLabel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => {
        const { CurrentPageLabel } = slot;
        return Object.assign({}, slot, {
            NumberOfPages: () => (
                <CurrentPageLabel>
                    {(props) => (
                        <span data-testid="current-page-label">
                            {props.numberOfPages}
                            {props.pageLabel !== `${props.currentPage + 1}` && `(${props.pageLabel})`}
                        </span>
                    )}
                </CurrentPageLabel>
            ),
        });
    };

    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });
    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    return (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Test <CurrentPageLabel>', async () => {
    const { findByTestId, getByTestId, rerender } = render(
        <TestCurrentPageLabel fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8');

    // Jump to the third page
    const page = await findByTestId('core__page-layer-3');
    mockIsIntersecting(page, true);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8');
});

test('Test <CurrentPageLabel> with custom page label', async () => {
    const pageLabelDocument = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels.pdf'))
    );
    const pageLabelDocument2 = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels-2.pdf'))
    );
    const { findByTestId, getByTestId, rerender } = render(<TestCurrentPageLabel fileUrl={pageLabelDocument} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4(i)');

    // Jump to the third page
    let page = await findByTestId('core__page-layer-2');
    mockIsIntersecting(page, true);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4(iii)');

    rerender(<TestCurrentPageLabel fileUrl={pageLabelDocument2} />);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8(296)');

    // Jump to other page
    page = await findByTestId('core__page-layer-5');
    mockIsIntersecting(page, true);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8(301)');
});
