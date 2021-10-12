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
                height: '100%',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.3)',
                    overflow: 'auto',
                    width: '30%',
                }}
            >
                <Thumbnails
                    renderCurrentPageLabel={(props) => (
                        <>
                            {`${props.pageIndex + 1} ${
                                props.pageLabel !== `${props.pageIndex + 1}` && `(${props.pageLabel})`
                            }`}
                        </>
                    )}
                />
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
    const pageLabelDocument2 = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels-2.pdf'))
    );
    const { findByText, getByTestId, rerender } = render(<TestPageLabel fileUrl={pageLabelDocument} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    let label = await findByText('3 (iii)');
    expect(label).toHaveClass('rpv-thumbnail__index');

    rerender(<TestPageLabel fileUrl={pageLabelDocument2} />);
    label = await findByText('5 (300)');
    expect(label).toHaveClass('rpv-thumbnail__index');
});
