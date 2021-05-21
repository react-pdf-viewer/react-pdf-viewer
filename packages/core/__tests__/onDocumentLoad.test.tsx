const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import Viewer from '../src/Viewer';

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