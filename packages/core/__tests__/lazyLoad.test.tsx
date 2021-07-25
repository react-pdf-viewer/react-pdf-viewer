import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src/Viewer';

test('Lazy load', async () => {
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={global.__SAMPLE_PDF__} />
        </div>
    );
    const { findByText, getByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
