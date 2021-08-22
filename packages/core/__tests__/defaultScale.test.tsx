import * as React from 'react';
import { render } from '@testing-library/react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { Viewer } from '../src/Viewer';
import { SpecialZoomLevel } from '../src/structs/SpecialZoomLevel';

const TestDefaultScaleSpecialZoomLevel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Viewer fileUrl={fileUrl} defaultScale={SpecialZoomLevel.PageWidth} plugins={[defaultLayoutPluginInstance]} />
    );
};

test('defaultScale option', async () => {
    const App = () => (
        <div style={{ height: '720px', width: '600px' }}>
            <Viewer fileUrl={global['__SAMPLE_PDF__']} defaultScale={1.5} />
        </div>
    );
    const { getByTestId, findByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const firstPage = await findByTestId('viewer-page-layer-0');
    mockIsIntersecting(firstPage, true);

    expect(parseInt(firstPage.style.width, 10)).toEqual(892);
    expect(parseInt(firstPage.style.height, 10)).toEqual(1263);
});

test('Set defaultScale as a special zoom level', async () => {
    const App = () => (
        <div style={{ height: '720px', width: '720px' }}>
            <TestDefaultScaleSpecialZoomLevel fileUrl={global['__MULTIPLE_PAGES_PDF__']} />
        </div>
    );
    const { getByTestId, findByTestId, findByText } = render(<App />);
    const rootEle = getByTestId('viewer');
    mockIsIntersecting(rootEle, true);

    rootEle['__jsdomMockClientHeight'] = 720;
    rootEle['__jsdomMockClientWidth'] = 720;

    const firstPage = await findByTestId('viewer-page-layer-0');
    mockIsIntersecting(firstPage, true);

    const layoutBody = await findByTestId('default-layout__body');
    layoutBody['__jsdomMockClientHeight'] = 677;
    layoutBody['__jsdomMockClientWidth'] = 673;

    mockResize(layoutBody);

    // Users shouldn't see a scrollbar
    // See the issue #698
    const pagesContainer = await findByTestId('zoom__popover-target-scale');
    expect(pagesContainer.innerHTML).toEqual('107%');
});
