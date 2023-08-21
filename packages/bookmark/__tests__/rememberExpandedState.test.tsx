import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { bookmarkPlugin } from '../src';

const TestRememberExpandedState: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    height: '50rem',
                    width: '50rem',
                    margin: '1rem auto',
                }}
            >
                <div
                    style={{
                        borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                        overflow: 'auto',
                        width: '15%',
                    }}
                >
                    <Bookmarks />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[bookmarkPluginInstance]} />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Remember expanded/collapsed state of each bookmark', async () => {
    const { findAllByLabelText, findByTestId, getByTestId } = render(
        <TestRememberExpandedState fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 560;

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

    await findByTestId('bookmark__container');

    // Toggle the `Parameters for Opening PDF Files` item
    const toggle = await findByTestId('bookmark__toggle-0-2');
    fireEvent.click(toggle);

    let subItems = await findAllByLabelText('Specifying parameters in a URL');
    expect(subItems.length).toEqual(3);

    let isSubItemExpanded = subItems[0].getAttribute('aria-expanded');
    expect(isSubItemExpanded).toEqual('false');

    // Toggle the `Specifying parameters in a URL` item
    const toggleSubItem = await findByTestId('bookmark__toggle-1-1');
    fireEvent.click(toggleSubItem);

    // Close the `Parameters for Opening PDF Files` item
    fireEvent.click(toggle);

    // and reopen it
    fireEvent.click(toggle);

    // The `Specifying parameters in a URL` item should be expanded
    subItems = await findAllByLabelText('Specifying parameters in a URL');
    isSubItemExpanded = subItems[0].getAttribute('aria-expanded');
    expect(isSubItemExpanded).toEqual('true');

    // There are two sub-items which are `URL examples` and `URL limitations`
    const numSubItems = subItems[0].querySelectorAll('li').length;
    expect(numSubItems).toEqual(2);
});
