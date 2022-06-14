import { render } from '@testing-library/react';
import * as React from 'react';
import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

test('Render document that does not exist', async () => {
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={'file:///../../../assets/not-found.pdf'} />
        </div>
    );
    const { findByText } = render(<App />);
    mockAllIsIntersecting(true);

    const errorMessage = await findByText('Missing PDF "/assets/not-found.pdf".');
    expect(errorMessage).toHaveClass('rpv-core__doc-error-text');
});
