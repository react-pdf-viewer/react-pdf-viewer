import * as React from 'react';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src/Viewer';
import { DocumentLoadEvent } from '../src';

const TestOnDocumentLoad: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const [numPages, setNumPages] = React.useState(0);
    const [fileLength, setFileLength] = React.useState(0);

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setNumPages(e.doc.numPages);
        setFileLength(e.file.data.length);
    };

    return (
        <>
            <div data-testid="file-length">{fileLength}</div>
            <div data-testid="num-pages">{numPages}</div>
            <div style={{ height: '720px' }}>
                <Viewer fileUrl={fileUrl} onDocumentLoad={handleDocumentLoad} />
            </div>
        </>
    );
};

test('onDocumentLoad() callback', async () => {
    const { findByTestId, getByTestId } = render(<TestOnDocumentLoad fileUrl={global['__MULTIPLE_PAGES_PDF__']} />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const numPagesLabel = await findByTestId('num-pages');
    expect(numPagesLabel.textContent).toEqual('2');

    const fileLengthLabel = await findByTestId('file-length');
    expect(fileLengthLabel.innerHTML).toEqual('3028');
});
