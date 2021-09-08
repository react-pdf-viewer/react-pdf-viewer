import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src/Viewer';

test('Single Page Viewer', async () => {
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={global['__MULTIPLE_PAGES_PDF__']} renderSinglePage />
        </div>
    );
    const { findByText, getByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const firstText = await findByText('A Simple PDF File');

    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});

test('Single Page Viewer with Initial Page', async () => {
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={global['__MULTIPLE_PAGES_PDF__']} initialPage={1} renderSinglePage />
        </div>
    );
    const { findByText, getByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const firstText = await findByText('Simple PDF File 2');

    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
