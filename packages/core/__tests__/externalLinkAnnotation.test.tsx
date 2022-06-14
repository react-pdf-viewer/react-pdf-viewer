import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

const fs = require('fs');
const path = require('path');

const TestExternalLinkAnnotation: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    return (
        <div style={{ height: '50rem', width: '50rem' }}>
            <Viewer fileUrl={fileUrl} />
        </div>
    );
};

test('Support external link annotation', async () => {
    const externalLinkDocument = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/external-link.pdf'))
    );
    const { findByTestId, getByTestId } = render(<TestExternalLinkAnnotation fileUrl={externalLinkDocument} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const linkContainer = await findByTestId('core__annotation--link-43R');
    const link = linkContainer.querySelector('a');
    expect(link?.getAttribute('data-target')).toEqual('external');
    expect(link?.getAttribute('href')).toEqual('m1-02-01.pdf#[2,{"name":"FitR"},-86,377,681,831]');
});
