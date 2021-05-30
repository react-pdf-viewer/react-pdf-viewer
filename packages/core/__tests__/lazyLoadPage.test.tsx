const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import Viewer from '../src/Viewer';

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
    expect(text).toHaveClass('rpv-core__text-layer-text');

    // Set the second page as visible
    mockIsIntersecting(getByTestId('viewer-page-layer-1'), true);

    text = await findByText('2007 Adobe Systems', { exact: false });
    expect(text).toHaveClass('rpv-core__text-layer-text');
    expect(text).toHaveTextContent('© 2007 Adobe Systems Incorporated. All rights reserved.');

    const lastPage = getByTestId('viewer-page-layer-7');
    expect(lastPage).not.toHaveTextContent('URL examples');

    // Set the last page as visible
    mockIsIntersecting(lastPage, true);
    text = await findByText('Acrobat SDK', { exact: false });
    expect(text).toHaveTextContent('Adobe Acrobat SDK');
});