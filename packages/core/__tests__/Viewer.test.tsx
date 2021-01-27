const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import Viewer from '../src/Viewer';

describe('Test Viewer', () => {
    test('Render document that does not exist', async () => {
        const App = () => (
            <div style={{ height: '100px' }}>
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
});

test('Load document successfully', async () => {
    const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/sample.pdf'));
    const App = () => (
        <div style={{ height: '100px' }}>
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
