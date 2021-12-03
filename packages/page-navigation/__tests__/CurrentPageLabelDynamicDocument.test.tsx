import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { pageNavigationPlugin } from '../src';

const TestCurrentPageLabelDynamicDocument = () => {
    const [fileUrl, setFileUrl] = React.useState('');
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { CurrentPageLabel } = pageNavigationPluginInstance;

    return (
        <>
            <div style={{ marginRight: '8px' }}>
                <button onClick={() => setFileUrl(global['__OPEN_PARAMS_PDF__'])}>Load document 1</button>
                <button onClick={() => setFileUrl(global['__MULTIPLE_PAGES_PDF__'])}>Load document 2</button>
            </div>
            <div style={{ height: '720px' }}>
                {fileUrl && (
                    <div>
                        <div data-testid="current-page-label">
                            <CurrentPageLabel>
                                {(props) => (
                                    <>
                                        {props.currentPage + 1} of {props.numberOfPages}
                                    </>
                                )}
                            </CurrentPageLabel>
                        </div>
                        <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
                    </div>
                )}
            </div>
        </>
    );
};

test('Test <CurrentPageLabel> with dynamic document', async () => {
    const { findByTestId, getByText } = render(<TestCurrentPageLabelDynamicDocument />);

    // Click the `Load document 1` button
    fireEvent.click(getByText('Load document 1'));

    let viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    let pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 8');

    // Jump to the fourth page
    let page = await findByTestId('core__page-layer-3');
    mockIsIntersecting(page, true);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('4 of 8');

    // Click the `Load document 2` button
    fireEvent.click(getByText('Load document 2'));

    viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('1 of 2');

    // Jump to the second page
    page = await findByTestId('core__page-layer-1');
    mockIsIntersecting(page, true);
    pageLabel = await findByTestId('current-page-label');
    expect(pageLabel.textContent).toEqual('2 of 2');
});
