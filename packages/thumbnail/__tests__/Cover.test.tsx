import * as React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Viewer } from '@react-pdf-viewer/core';
import type { Plugin, RenderViewer } from '@react-pdf-viewer/core';

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
}> = ({ fileUrl }) => (
    <div
        style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            height: '20rem',
            width: '20rem',
            margin: '1rem auto',
        }}
    >
        <ThumbnailCover fileUrl={fileUrl} pageIndex={1} />
    </div>
);

test('Test <Cover />', async () => {
    const { findByTestId, getByTestId } = render(<TestCover fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 318;
    viewerEle['__jsdomMockClientWidth'] = 318;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const coverLoader = getByTestId('thumbnail__cover-loader');
    mockIsIntersecting(coverLoader, true);
    coverLoader['__jsdomMockClientHeight'] = 318;
    coverLoader['__jsdomMockClientWidth'] = 318;

    const image = await findByTestId('thumbnail__cover-image');
    const src = image.getAttribute('src');
    expect(src.length).toEqual(61722);
    expect(src.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAAE+CAYAAACKpyy5AAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQV'
    );
});
