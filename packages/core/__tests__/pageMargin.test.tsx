import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import type { PageLayout } from '../src';
import { SpecialZoomLevel, Viewer } from '../src';

const TestPageMargin: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const pageLayout: PageLayout = {
        buildPageStyles: () => ({
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
        }),
        transformSize: ({ size }) => ({ height: size.height + 30, width: size.width + 30 }),
    };

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '50rem',
                width: '50rem',
            }}
        >
            <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageFit} pageLayout={pageLayout} />
        </div>
    );
};

test('Page margin', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestPageMargin fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    const pageContainer = await findByLabelText('Page 1');
    expect(pageContainer.style.height).toEqual('812px');

    const pageLayer = await findByTestId('core__page-layer-0');
    expect(pageLayer.style.height).toEqual('782px');
});
