const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { render } from '@testing-library/react';

import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import Viewer from '../src/Viewer';

test('Load document successfully', async () => {
    const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/sample.pdf'));
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={new Uint8Array(rawSamplePdf)} />
        </div>
    );
    const { findByText } = render(<App />);
    mockAllIsIntersecting(true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
