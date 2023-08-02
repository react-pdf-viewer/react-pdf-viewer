import { PdfJsApiContext, PrimaryButton, ScrollMode, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { scrollModePlugin } from '../src';

const TestSwitchScrollMode: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const scrollModePluginInstance = scrollModePlugin();
    const { switchScrollMode } = scrollModePluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    marginBottom: '1rem',
                }}
            >
                <PrimaryButton onClick={() => switchScrollMode(ScrollMode.Horizontal)}>
                    Switch to horizontal mode
                </PrimaryButton>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} defaultScale={0.5} plugins={[scrollModePluginInstance]} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('call switchScrollMode() method', async () => {
    const { findByTestId, findByText, getByTestId } = render(
        <TestSwitchScrollMode fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

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
    await findByTestId('core__text-layer-4');
    await findByTestId('core__annotation-layer-4');

    // Set the second page as visible
    const page = await findByTestId('core__page-layer-1');
    expect(parseInt(page.style.width, 10)).toEqual(297);
    expect(parseInt(page.style.height, 10)).toEqual(396);

    const switchModeButton = await findByText('Switch to horizontal mode');
    fireEvent.click(switchModeButton);

    const pagesContainer = await findByTestId('core__inner-pages');
    expect(pagesContainer).toHaveClass('rpv-core__inner-pages--horizontal');
});
