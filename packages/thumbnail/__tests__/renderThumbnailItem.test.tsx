import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { classNames, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { thumbnailPlugin, RenderThumbnailItemProps } from '../src';

const TestRenderThumbnailItem: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <div
            key={props.pageIndex}
            className={classNames({
                'custom-thumbnail-item': true,
                'custom-thumbnail-item--selected': props.pageIndex === props.currentPage,
            })}
            data-testid={`thumbnail-${props.pageIndex}`}
            style={{
                backgroundColor: props.pageIndex === props.currentPage ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
            }}
            onClick={props.onJumpToPage}
        >
            {props.renderPageThumbnail}
        </div>
    );

    const thumbnailPluginInstance = thumbnailPlugin({
        renderThumbnailItem,
    });
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
                <Thumbnails />
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
            </div>
        </div>
    );
};

test('Test renderThumbnailItem option', async () => {
    const { findByTestId, getByTestId } = render(<TestRenderThumbnailItem fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const thumbnailsContainer = await findByTestId('thumbnail__list');
    expect(thumbnailsContainer.querySelectorAll('.custom-thumbnail-item').length).toEqual(8);

    // Click on the second thumbnail
    let secondThumbnail = await findByTestId('thumbnail-1');
    expect(secondThumbnail).toHaveClass('custom-thumbnail-item');
    fireEvent.click(secondThumbnail);

    secondThumbnail = await findByTestId('thumbnail-1');
    expect(secondThumbnail).toHaveClass('custom-thumbnail-item--selected');
});
