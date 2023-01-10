import type { PageLayout } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestPageMargin: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
                display: 'flex',
                height: '50rem',
                width: '50rem',
            }}
        >
            <Viewer
                fileUrl={fileUrl}
                defaultScale={0.75}
                pageLayout={pageLayout}
                plugins={[defaultLayoutPluginInstance]}
            />
        </div>
    );
};

test('Page margin', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestPageMargin fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

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
    expect(pageContainer.style.height).toEqual('624px');

    const pageLayer = await findByTestId('core__page-layer-0');
    expect(pageLayer.style.height).toEqual('594px');
});
