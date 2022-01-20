import * as React from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { Button, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { pageNavigationPlugin } from '../src';

const TestCurrentPageLabelDynamicDocument = () => {
    const [fileUrl, setFileUrl] = React.useState('');
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageLabel } = pageNavigationPluginInstance;

    return (
        <div>
            <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                <div style={{ marginRight: '0.5rem' }}>
                    <Button onClick={() => setFileUrl(global['__OPEN_PARAMS_PDF__'])}>Load document 1</Button>
                </div>
                <Button onClick={() => setFileUrl(global['__MULTIPLE_PAGES_PDF__'])}>Load document 2</Button>
            </div>

            {fileUrl && (
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
                                    {props.currentPage + 1} of {props.numberOfPages}
                                </>
                            )}
                        </CurrentPageLabel>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
                    </div>
                </div>
            )}
        </div>
    );
};

test('Test <CurrentPageLabel> with dynamic document', async () => {
    const { findByTestId, getByTestId, getByText } = render(<TestCurrentPageLabelDynamicDocument />);

    // Click the `Load document 1` button
    fireEvent.click(getByText('Load document 1'));

    let viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 766;
    viewerEle['__jsdomMockClientWidth'] = 798;

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 8');

    // Jump to the fourth page
    let pagesContainer = getByTestId('core__inner-pages');
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
            scrollTop: 2662,
        },
    });

    await findByTestId('core__page-layer-3');
    await waitForElementToBeRemoved(() => getByTestId('core__page-layer-loading-3'));
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4 of 8');

    // Click the `Load document 2` button
    fireEvent.click(getByText('Load document 2'));

    viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 766;
    viewerEle['__jsdomMockClientWidth'] = 798;

    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 2');

    // Jump to the second page
    pagesContainer = getByTestId('core__inner-pages');
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
            scrollTop: 895,
        },
    });

    await findByTestId('core__page-layer-1');
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('2 of 2');
});
