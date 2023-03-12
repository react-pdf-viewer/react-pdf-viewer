import type { Plugin, RenderViewer } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { thumbnailPlugin } from '../src';

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
    width: number;
}> = ({ fileUrl, pageIndex, width }) => {
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => pageIndex} width={width} />,
    });

    return <Viewer fileUrl={fileUrl} plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]} />;
};

const TestCover: React.FC<{
    fileUrl: Uint8Array;
    pageIndex: number;
    width: number;
}> = ({ fileUrl, pageIndex, width }) => (
    <div
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            minHeight: '20rem',
            width: '20rem',
            margin: '1rem auto',
        }}
    >
        <ThumbnailCover fileUrl={fileUrl} pageIndex={pageIndex} width={width} />
    </div>
);

test('Test Cover width property', async () => {
    const { findByTestId, getByTestId } = render(
        <TestCover fileUrl={global['__OPEN_PARAMS_PDF__']} pageIndex={1} width={300} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 500;
    viewerEle['__jsdomMockClientWidth'] = 318;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 500;
    coverInner['__jsdomMockClientWidth'] = 318;

    const image = await findByTestId('thumbnail__cover-image');
    const src = image.getAttribute('src');
    expect(src?.length).toEqual(96570);
    expect(src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAGQCAYAAAAUdV17AAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQV'
    );
});
