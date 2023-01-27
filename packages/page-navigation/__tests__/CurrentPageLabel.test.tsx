import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
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
                flexDirection: 'column',
                height: '50rem',
                width: '50rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    height: '2rem',
                    justifyContent: 'center',
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
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
            </div>
        </div>
    );
};

test('Test <CurrentPageLabel>', async () => {
    const { findByTestId, getByTestId } = render(<TestCurrentPageLabel fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 766;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__canvas-layer-0');
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__canvas-layer-1');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__canvas-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__canvas-layer-3');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');
    await findByTestId('core__canvas-layer-4');
    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8');

    // Jump to the third page
    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 766,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 1782,
        },
    });

    await findByTestId('core__canvas-layer-3');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');
    await findByTestId('core__canvas-layer-4');
    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');
    await findByTestId('core__canvas-layer-5');
    await findByTestId('core__text-layer-5');
    await findByTestId('core__annotation-layer-5');

    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8');
});

test('Test <CurrentPageLabel> with custom page label', async () => {
    const pageLabelDocument2 = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels-2.pdf'))
    );
    const { findByTestId, getByTestId } = render(<TestCurrentPageLabel fileUrl={pageLabelDocument2} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 766;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__canvas-layer-0');
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__canvas-layer-1');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__canvas-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__canvas-layer-3');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');
    await findByTestId('core__canvas-layer-4');
    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8(296)');

    // Jump to other page
    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 766,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 1782,
        },
    });

    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');
    await findByTestId('core__canvas-layer-3');
    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');
    await findByTestId('core__canvas-layer-4');
    await findByTestId('core__text-layer-5');
    await findByTestId('core__annotation-layer-5');
    await findByTestId('core__canvas-layer-5');

    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('8(298)');
});
