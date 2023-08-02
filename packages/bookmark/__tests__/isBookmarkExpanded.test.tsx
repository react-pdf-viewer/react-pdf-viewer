import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { bookmarkPlugin } from '../src';

const TestIsBookmarkExpanded: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const bookmarkPluginInstance = bookmarkPlugin();
    const { Bookmarks } = bookmarkPluginInstance;
    const setBookmarkExpanded = ({ depth }) => depth === 0;

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
                        width: '15rem',
                    }}
                >
                    <Bookmarks isBookmarkExpanded={setBookmarkExpanded} />
                </div>
                <div style={{ flex: 1 }}>
                    <Viewer fileUrl={fileUrl} plugins={[bookmarkPluginInstance]} />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Set bookmarks expanded initially', async () => {
    const { findByTestId, getByTestId } = render(<TestIsBookmarkExpanded fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const bookmarksContainer = await findByTestId('bookmark__container');

    // Find all bookmark items
    const bookmarks = Array.from(bookmarksContainer.querySelectorAll('li'));
    expect(bookmarks.length).toEqual(7);

    const heading = bookmarks[6];
    expect(heading.getAttribute('aria-label')).toEqual('Specifying parameters in a URL');
    expect(heading.getAttribute('aria-level')).toEqual('2');
    expect(heading.textContent).toEqual('Specifying parameters in a URL');
});
