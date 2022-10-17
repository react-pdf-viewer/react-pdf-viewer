import type { Plugin, RenderViewer } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { thumbnailPlugin } from '../src';

const fs = require('fs');
const path = require('path');

interface PageThumbnailPluginProps {
    PageThumbnail: React.ReactElement;
}

const pageThumbnailPlugin = (props: PageThumbnailPluginProps): Plugin => {
    const { PageThumbnail } = props;

    return {
        renderViewer: (renderProps: RenderViewer) => {
            let { slot } = renderProps;

            slot.children = PageThumbnail;

            // Reset the sub slot
            slot.subSlot.attrs = {};
            slot.subSlot.children = <></>;

            return slot;
        },
    };
};

const ThumbnailCover: React.FC<{
    fileUrl: Uint8Array;
    pageIndex: number;
}> = ({ fileUrl, pageIndex }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => pageIndex} />,
    });

    return <Viewer fileUrl={fileUrl} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />;
};

const TestCover: React.FC<{
    fileUrl: Uint8Array;
    pageIndex: number;
}> = ({ fileUrl, pageIndex }) => (
    <div
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            height: '40rem',
            width: '40rem',
            margin: '1rem auto',
        }}
    >
        <ThumbnailCover fileUrl={fileUrl} pageIndex={pageIndex} />
    </div>
);

test('Test <Cover /> of a rotated page', async () => {
    const rotatedDocument = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/pdf-open-parameters-rotated.pdf'))
    );
    const { findByTestId, getByTestId } = render(<TestCover fileUrl={rotatedDocument} pageIndex={3} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 638;
    viewerEle['__jsdomMockClientWidth'] = 638;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 638;
    coverInner['__jsdomMockClientWidth'] = 638;

    const image = await findByTestId('thumbnail__cover-image');
    const src = image.getAttribute('src');
    expect(src?.length).toEqual(88414);
    expect(src?.slice(-100)).toEqual(
        '8RNCCCGEKCOk+AkhhBBClBFS/IQQQgghyggpfkIIIYQQZYQUPyGEEEKIMkKKnxBCCCFEGfF/V53apR4vTaIAAAAASUVORK5CYII='
    );
});
