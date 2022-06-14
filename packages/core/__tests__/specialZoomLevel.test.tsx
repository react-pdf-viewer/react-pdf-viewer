import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { SpecialZoomLevel, Viewer } from '../src';

const TestDefaultScaleSpecialZoomLevel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageWidth} plugins={[defaultLayoutPluginInstance]} />
    );
};

test('Set defaultScale as a special zoom level', async () => {
    const App = () => (
        <div style={{ height: '50rem', width: '50rem' }}>
            <TestDefaultScaleSpecialZoomLevel fileUrl={global['__OPEN_PARAMS_PDF__']} />
        </div>
    );
    const { findByTestId, getByTestId } = render(<App />);

    const rootEle = getByTestId('core__viewer');
    mockIsIntersecting(rootEle, true);
    rootEle['__jsdomMockClientHeight'] = 800;
    rootEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer['__jsdomMockClientHeight'] = 753;
    pagesContainer['__jsdomMockClientWidth'] = 758;
    mockResize(pagesContainer);

    // Users shouldn't see a scrollbar
    // See the issue #698
    const currentScale = await findByTestId('zoom__popover-target-scale');
    await waitFor(() => expect(currentScale.innerHTML).toEqual('125%'));
});

test('Keep special defaultScale after resizing', async () => {
    const App = () => (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer defaultScale={SpecialZoomLevel.PageWidth} fileUrl={global['__OPEN_PARAMS_PDF__']} />
        </div>
    );
    const { findByTestId, getByTestId } = render(<App />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    let firstPage = await findByTestId('core__page-layer-0');
    const w1 = parseInt(firstPage.style.width, 10);
    const h1 = parseInt(firstPage.style.height, 10);
    expect(w1).toEqual(783);
    expect(h1).toEqual(1044);

    const pagesContainer = await findByTestId('core__inner-pages');

    // Resize
    pagesContainer['__jsdomMockClientHeight'] = 800;
    pagesContainer['__jsdomMockClientWidth'] = 640;
    mockResize(pagesContainer);

    // Scroll to the 4th page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 2250,
        },
    });

    await findByTestId('core__text-layer-3');

    const fourthPage = await findByTestId('core__page-layer-3');
    await waitFor(() => expect(parseInt(fourthPage.style.width, 10)).toEqual(623));
    await waitFor(() => expect(parseInt(fourthPage.style.height, 10)).toEqual(830));
});
