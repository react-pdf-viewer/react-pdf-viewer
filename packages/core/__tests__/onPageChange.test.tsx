import * as React from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { PageChangeEvent, Viewer } from '../src';

const TestOnPageChange: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const [visitedPages, setVisitedPages] = React.useState([]);

    const handlePageChange = (e: PageChangeEvent) => {
        setVisitedPages((visitedPages) => visitedPages.concat(e.currentPage));
    };

    return (
        <>
            <div data-testid="visited-pages">{visitedPages.join(',')}</div>
            <div style={{ height: '50rem', width: '50rem' }}>
                <Viewer fileUrl={fileUrl} onPageChange={handlePageChange} />
            </div>
        </>
    );
};

test('onPageChange() callback', async () => {
    const { findByTestId, getByTestId } = render(<TestOnPageChange fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const visitedPages = await findByTestId('visited-pages');
    expect(visitedPages.textContent).toEqual('0');

    const pagesContainer = getByTestId('core__inner-pages');
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

    // Scroll to the third page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 2408,
        },
    });

    expect(visitedPages.textContent).toEqual('0,3');
});
