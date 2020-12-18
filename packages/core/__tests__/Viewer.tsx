const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import Viewer from '../src/Viewer';

const windowIntersectionObserver = window.IntersectionObserver;
const intersectionObserverMock = {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
};

beforeAll(() => {
    (window as any).IntersectionObserver = jest.fn(() => intersectionObserverMock);
});

afterAll(() => {
    window.IntersectionObserver = windowIntersectionObserver;
});

test('render document that does not exist', async () => {
    const App = () => (
        <div style={{ height: '100px' }}>
            <Viewer
                fileUrl={'file:///../../../assets/not-found.pdf'}
            />
        </div>
    );
    const { findByText } = render(<App />);
    
    const errorMessage = await findByText('Missing PDF "/assets/not-found.pdf".');
    expect(errorMessage).toHaveClass('rpv-core-doc-error-text');
});

test('load document successfully', async () => {
    const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/sample.pdf'));
    const App = () => (
        <div style={{ height: '100px' }}>
            <Viewer
                fileUrl={new Uint8Array(rawSamplePdf)}
            />
        </div>
    );
    const { findByText } = render(<App />);
    
    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core-text');
});
