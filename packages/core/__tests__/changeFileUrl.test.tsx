import { fireEvent, render } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { PdfJsApiContext, Viewer, type PdfJsApiProvider } from '../src';

test('fileUrl as a prop', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = ({ fileUrl }) => (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div style={{ height: '720px' }}>
                <Viewer fileUrl={fileUrl} />
            </div>
        </PdfJsApiContext.Provider>
    );
    const { findByText, rerender } = render(<App fileUrl={global['__SAMPLE_PDF__']} />);
    mockAllIsIntersecting(true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');

    rerender(<App fileUrl={global['__MULTIPLE_PAGES_PDF__']} />);
    const text = await findByText('A Simple PDF File');
    expect(text).toHaveClass('rpv-core__text-layer-text');
});

test('fileUrl as a state', async () => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const App = () => {
        const [fileUrl, setFileUrl] = React.useState(global['__HELLO_PDF__']);
        return (
            <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
                <div style={{ marginRight: '8px' }}>
                    <button onClick={() => setFileUrl(global['__SAMPLE_PDF__'])}>Load document 1</button>
                    <button onClick={() => setFileUrl(global['__MULTIPLE_PAGES_PDF__'])}>Load document 2</button>
                </div>
                <div style={{ height: '720px' }}>
                    <Viewer fileUrl={fileUrl} />
                </div>
            </PdfJsApiContext.Provider>
        );
    };
    const { getByText, findByText } = render(<App />);
    mockAllIsIntersecting(true);

    let firstText = await findByText('Hello, world!');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');

    // Click the `Load document 1` button
    fireEvent.click(getByText('Load document 1'));
    firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');

    // Click the `Load document 2` button
    fireEvent.click(getByText('Load document 2'));
    const text = await findByText('A Simple PDF File');
    expect(text).toHaveClass('rpv-core__text-layer-text');
});
