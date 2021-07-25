import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src/Viewer';

test('defaultScale option', async () => {
    const App = () => (
        <div style={{ height: '720px', width: '600px' }}>
            <Viewer fileUrl={global.__SAMPLE_PDF__} defaultScale={1.5} />
        </div>
    );
    const { getByTestId, findByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const firstPage = await findByTestId('viewer-page-layer-0');
    mockIsIntersecting(firstPage, true);

    expect(parseInt(firstPage.style.width, 10)).toEqual(892);
    expect(parseInt(firstPage.style.height, 10)).toEqual(1263);
});
