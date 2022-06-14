import { render } from '@testing-library/react';
import * as React from 'react';
import { mockAllIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

test('Load document successfully', async () => {
    const App = () => (
        <div style={{ height: '720px' }}>
            <Viewer fileUrl={global['__SAMPLE_PDF__']} />
        </div>
    );
    const { findByText } = render(<App />);
    mockAllIsIntersecting(true);

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
