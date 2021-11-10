import * as React from 'react';
import { render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { pageNavigationPlugin } from '../src';

const fs = require('fs');
const path = require('path');

const TestCurrentPageLabel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageLabel } = pageNavigationPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                height: '100%',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                    overflow: 'auto',
                    width: '30%',
                }}
                data-testid="current-page-label"
            >
                <CurrentPageLabel>
                    {(props) => (
                        <>
                            {props.numberOfPages}
                            {props.pageLabel !== `${props.currentPage + 1}` && `(${props.pageLabel})`}
                        </>
                    )}
                </CurrentPageLabel>
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
            </div>
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
