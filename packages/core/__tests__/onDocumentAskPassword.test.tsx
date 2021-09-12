import * as React from 'react';
import { render } from '@testing-library/react';
import { waitForElementToBeRemoved } from '@testing-library/dom';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src/Viewer';
import { DocumentAskPasswordEvent, DocumentLoadEvent } from '../src';

const TestOnDocumentAskPassword: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const [loaded, setLoaded] = React.useState(false);

    const handleDocumentAskPassword = (e: DocumentAskPasswordEvent) => {
        e.verifyPassword('123456');
    };

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setLoaded(true);
    };

    return (
        <>
            {!loaded && <div data-testid="loaded">{loaded}</div>}
            <div style={{ height: '720px' }}>
                <Viewer
                    fileUrl={fileUrl}
                    onDocumentAskPassword={handleDocumentAskPassword}
                    onDocumentLoad={handleDocumentLoad}
                />
            </div>
        </>
    );
};

test('onDocumentAskPassword() callback', async () => {
    const { findByText, getByTestId, queryByText } = render(
        <TestOnDocumentAskPassword fileUrl={global['__SAMPLE_PDF__']} />
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    await waitForElementToBeRemoved(getByTestId('loaded'));

    const firstText = await findByText('Adobe Acrobat PDF Files');
    expect(firstText).toHaveClass('rpv-core__text-layer-text');
});
