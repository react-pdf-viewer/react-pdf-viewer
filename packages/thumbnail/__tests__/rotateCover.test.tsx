import type { Plugin, RenderViewer } from '@react-pdf-viewer/core';
import { PrimaryButton, RotateDirection, Viewer } from '@react-pdf-viewer/core';
import { rotatePlugin } from '@react-pdf-viewer/rotate';
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

const TestCover: React.FC<{
    fileUrl: Uint8Array;
    pageIndex: number;
}> = ({ fileUrl, pageIndex }) => {
    const rotatePluginInstance = rotatePlugin();
    const { RotatePage } = rotatePluginInstance;

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Cover } = thumbnailPluginInstance;
    const pageThumbnailPluginInstance = pageThumbnailPlugin({
        PageThumbnail: <Cover getPageIndex={() => pageIndex} />,
    });

    return (
        <div
            data-testid="root"
            className="rpv-core__viewer"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '50rem',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '4px',
                }}
            >
                <div style={{ padding: '0 0.25rem' }}>
                    <RotatePage>
                        {(props) => (
                            <PrimaryButton
                                testId="rotate-forward"
                                onClick={() => props.onRotatePage(pageIndex, RotateDirection.Forward)}
                            >
                                Rotate the cover
                            </PrimaryButton>
                        )}
                    </RotatePage>
                </div>
                <div style={{ padding: '0 0.25rem' }}>
                    <RotatePage>
                        {(props) => (
                            <PrimaryButton
                                testId="rotate-backward"
                                onClick={() => props.onRotatePage(pageIndex, RotateDirection.Backward)}
                            >
                                Rotate the cover backward
                            </PrimaryButton>
                        )}
                    </RotatePage>
                </div>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[pageThumbnailPluginInstance, rotatePluginInstance, thumbnailPluginInstance]}
                />
            </div>
        </div>
    );
};

test('Rotate cover', async () => {
    const rotatedDocument = new Uint8Array(
        fs.readFileSync(path.resolve(__dirname, '../../../samples/pdf-open-parameters-rotated.pdf'))
    );
    const { findByTestId, getByTestId } = render(<TestCover fileUrl={rotatedDocument} pageIndex={3} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 757;
    viewerEle['__jsdomMockClientWidth'] = 1022;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 757;
    coverInner['__jsdomMockClientWidth'] = 1022;

    const image = await findByTestId('thumbnail__cover-image');
    const src = image.getAttribute('src');
    expect(src?.length).toEqual(162698);
    expect(src?.slice(-100)).toEqual(
        'AQAAYELiAQAAYELiAQAAYELiAQAAYELiAQAAYELiAQAAYELiAQAAYELiAQAAYELiAQAAYCIgIrPpY7RHcwAAAABJRU5ErkJggg=='
    );
});
