import { Viewer } from '@react-pdf-viewer/core';
import { render } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { RenderCurrentPageLabelProps, thumbnailPlugin } from '../src';

const fs = require('fs');
const path = require('path');

const TestPageLabel: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const renderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => (
        <>{`${props.pageIndex + 1} ${props.pageLabel !== `${props.pageIndex + 1}` && `(${props.pageLabel})`}`}</>
    );

    const thumbnailPluginInstance = thumbnailPlugin({
        renderCurrentPageLabel,
    });
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

test('Render custom page label', async () => {
    const pageLabelDocument = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels.pdf'))
    );
    const { findByTestId, findByText, getByTestId } = render(<TestPageLabel fileUrl={pageLabelDocument} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const label = await findByText('3 (iii)');
    expect(label).toHaveClass('rpv-thumbnail__label');
});

test('Render custom page label 2', async () => {
    const pageLabelDocument2 = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels-2.pdf'))
    );
    const { findByTestId, findByText, getByTestId } = render(<TestPageLabel fileUrl={pageLabelDocument2} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    const label = await findByText('5 (300)');
    expect(label).toHaveClass('rpv-thumbnail__label');
});
