const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { render } from '@testing-library/react';

import { mockAllIsIntersecting, mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import Viewer from '../src/Viewer';

describe('Test Viewer', () => {
    test('Render document that does not exist', async () => {
        const App = () => (
            <div style={{ height: '720px' }}>
                <Viewer
                    fileUrl={'file:///../../../assets/not-found.pdf'}
                />
            </div>
        );
        const { findByText } = render(<App />);
        mockAllIsIntersecting(true);
        
        const errorMessage = await findByText('Missing PDF "/assets/not-found.pdf".');
        expect(errorMessage).toHaveClass('rpv-core-doc-error-text');
    });

    test('Load document successfully', async () => {
        const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/sample.pdf'));
        const App = () => (
            <div style={{ height: '720px' }}>
                <Viewer
                    fileUrl={new Uint8Array(rawSamplePdf)}
                />
            </div>
        );
        const { findByText } = render(<App />);
        mockAllIsIntersecting(true);
        
        const firstText = await findByText('Adobe Acrobat PDF Files');
        expect(firstText).toHaveClass('rpv-core-text');
    });

    test('Lazy load', async () => {
        const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/sample.pdf'));
        const App = () => (
            <div style={{ height: '720px' }}>
                <Viewer
                    fileUrl={new Uint8Array(rawSamplePdf)}
                />
            </div>
        );
        const { findByText, getByTestId } = render(<App />);
        mockIsIntersecting(getByTestId('viewer'), true);

        const firstText = await findByText('Adobe Acrobat PDF Files');
        expect(firstText).toHaveClass('rpv-core-text');
    });

    test('Lazy load page', async () => {
        const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/pdf-open-parameters.pdf'));
        const App = () => (
            <div style={{ height: '720px' }}>
                <Viewer
                    fileUrl={new Uint8Array(rawSamplePdf)}
                />
            </div>
        );
        const { findByText, getByTestId } = render(<App />);
        mockIsIntersecting(getByTestId('viewer'), true);

        let text = await findByText('Parameters for Opening PDF Files');
        expect(text).toHaveClass('rpv-core-text');

        // Set the second page as visible
        mockIsIntersecting(getByTestId('viewer-page-layer-1'), true);

        text = await findByText('2007 Adobe Systems', { exact: false });
        expect(text).toHaveClass('rpv-core-text');
        expect(text).toHaveTextContent('© 2007 Adobe Systems Incorporated. All rights reserved.');

        const lastPage = getByTestId('viewer-page-layer-7');
        expect(lastPage).not.toHaveTextContent('URL examples');

        // Set the last page as visible
        mockIsIntersecting(lastPage, true);
        text = await findByText('Acrobat SDK', { exact: false });
        expect(text).toHaveTextContent('Adobe Acrobat SDK');
    });

    test('defaultScale option', async () => {
        const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/sample.pdf'));
        const App = () => (
            <div style={{ height: '720px', width: '600px' }}>
                <Viewer
                    fileUrl={new Uint8Array(rawSamplePdf)}
                    defaultScale={1.5}
                />
            </div>
        );
        const { getByTestId, findByTestId } = render(<App />);
        mockIsIntersecting(getByTestId('viewer'), true);
        
        const firstPage = await findByTestId('viewer-page-layer-0');
        mockIsIntersecting(firstPage, true);
        
        expect(parseInt(firstPage.style.width, 10)).toEqual(892);
        expect(parseInt(firstPage.style.height, 10)).toEqual(1263);
    });

    const TestOnDocumentLoad: React.FC<{
        fileUrl: Uint8Array
    }> = ({ fileUrl }) => {
        const [numPages, setNumPages] = React.useState(0);

        return (
            <>
            <div data-testid='num-pages'>{numPages}</div>
            <div style={{ height: '720px' }}>
                <Viewer
                    fileUrl={fileUrl}
                    onDocumentLoad={(e) => setNumPages(e.doc.numPages)}
                />
            </div>
            </>
        );
    };

    test('onDocumentLoad() callback', async () => {
        const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/pdf-open-parameters.pdf'));

        const { findByTestId, getByTestId } = render(<TestOnDocumentLoad fileUrl={new Uint8Array(rawSamplePdf)} />);
        mockIsIntersecting(getByTestId('viewer'), true);

        const numPagesLabel = await findByTestId('num-pages');
        expect(numPagesLabel.textContent).toEqual("8");
    });
});
