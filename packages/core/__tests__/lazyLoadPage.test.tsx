import { render } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

test('Lazy load page', async () => {
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={new Uint8Array(global['__MULTIPLE_PAGES_PDF__'])} />
        </div>
    );
    const { findByText, getByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    let text = await findByText('A Simple PDF File');
    expect(text).toHaveClass('rpv-core__text-layer-text');

    // Set the second page as visible
    mockIsIntersecting(getByTestId('core__page-layer-1'), true);

    text = await findByText('continued from page 1', { exact: false });
    expect(text).toHaveClass('rpv-core__text-layer-text');
    expect(text).toHaveTextContent('...continued from page 1. Yet more text. And more text. And more text.');
});
