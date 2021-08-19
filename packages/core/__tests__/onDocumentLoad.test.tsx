import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src/Viewer';

const TestOnDocumentLoad: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const [numPages, setNumPages] = React.useState(0);

    return (
        <>
            <div data-testid="num-pages">{numPages}</div>
            <div style={{ height: '720px' }}>
                <Viewer fileUrl={fileUrl} onDocumentLoad={(e) => setNumPages(e.doc.numPages)} />
            </div>
        </>
    );
};

test('onDocumentLoad() callback', async () => {
    const { findByTestId, getByTestId } = render(<TestOnDocumentLoad fileUrl={global['__OPEN_PARAMETERS_PDF__']} />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const numPagesLabel = await findByTestId('num-pages');
    expect(numPagesLabel.textContent).toEqual('8');
});
