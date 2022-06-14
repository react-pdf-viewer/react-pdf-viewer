import { render } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

test('defaultScale option', async () => {
    const App = () => (
        <div style={{ height: '720px', width: '600px' }}>
            <Viewer fileUrl={global['__SAMPLE_PDF__']} defaultScale={1.5} />
        </div>
    );
    const { getByTestId, findByTestId } = render(<App />);
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const firstPage = await findByTestId('core__page-layer-0');
    expect(parseInt(firstPage.style.width, 10)).toEqual(892);
    expect(parseInt(firstPage.style.height, 10)).toEqual(1263);
});
