import * as React from 'react';
import { render } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { thumbnailPlugin } from '../src';

const fs = require('fs');
const path = require('path');

const TestPageLabel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                height: '50rem',
                width: '50rem',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                    overflow: 'auto',
                    width: '30%',
                }}
            >
                <Thumbnails />
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
            </div>
        </div>
    );
};

test('Show default page number', async () => {
    const { findByTestId, getByTestId } = render(<TestPageLabel fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const label = await findByTestId('thumbnail__label-6');
    expect(label.textContent).toEqual('7');
    expect(label).toHaveClass('rpv-thumbnail__label');
});

test('Show custom page label', async () => {
    const pageLabelDocument = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels.pdf'))
    );
    const { findByTestId, getByTestId } = render(<TestPageLabel fileUrl={pageLabelDocument} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const label = await findByTestId('thumbnail__label-2');
    expect(label.textContent).toEqual('iii');
    expect(label).toHaveClass('rpv-thumbnail__label');
});

test('Show custom page label 2', async () => {
    const pageLabelDocument2 = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels-2.pdf'))
    );
    const { findByTestId, getByTestId } = render(<TestPageLabel fileUrl={pageLabelDocument2} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const label = await findByTestId('thumbnail__label-1');
    expect(label.textContent).toEqual('297');
    expect(label).toHaveClass('rpv-thumbnail__label');
});
