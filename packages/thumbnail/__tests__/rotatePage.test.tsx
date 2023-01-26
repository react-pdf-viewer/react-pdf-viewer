import { MinimalButton, Position, RotateDirection, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { RotateBackwardIcon, RotateForwardIcon } from '@react-pdf-viewer/rotate';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import type { RenderThumbnailItemProps } from '../src';
import { thumbnailPlugin } from '../src';

const TestRotatePage: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const renderThumbnailItem = (props: RenderThumbnailItemProps) => (
        <div
            key={props.key}
            className="custom-thumbnail-item"
            data-testid={`thumbnail-${props.pageIndex}`}
            style={{
                backgroundColor: props.pageIndex === props.currentPage ? 'rgba(0, 0, 0, 0.3)' : '#fff',
                cursor: 'pointer',
                padding: '0.5rem',
                width: '100%',
            }}
        >
            <div style={{ marginBottom: '0.5rem' }} onClick={props.onJumpToPage}>
                {props.renderPageThumbnail}
            </div>
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '0 auto',
                    width: '100px',
                }}
            >
                <Tooltip
                    position={Position.BottomCenter}
                    target={
                        <MinimalButton
                            testId={`rotate-forward-${props.pageIndex}`}
                            onClick={() => props.onRotatePage(RotateDirection.Forward)}
                        >
                            <RotateForwardIcon />
                        </MinimalButton>
                    }
                    content={() => 'Rotate clockwise'}
                    offset={{ left: 0, top: 8 }}
                />
                <Tooltip
                    position={Position.BottomCenter}
                    target={
                        <MinimalButton
                            testId={`rotate-backward-${props.pageIndex}`}
                            onClick={() => props.onRotatePage(RotateDirection.Backward)}
                        >
                            <RotateBackwardIcon />
                        </MinimalButton>
                    }
                    content={() => 'Rotate counterclockwise'}
                    offset={{ left: 0, top: 8 }}
                />
            </div>
        </div>
    );

    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    return (
        <div
            data-testid="root"
            style={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                height: '50rem',
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    width: '20%',
                }}
            >
                <Thumbnails renderThumbnailItem={renderThumbnailItem} />
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer defaultScale={0.5} fileUrl={fileUrl} plugins={[thumbnailPluginInstance]} />
            </div>
        </div>
    );
};

test('Rotate single page using renderThumbnailItem', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestRotatePage fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 818;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 798,
        width: 818,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    // Scroll to the third page
    fireEvent.scroll(pagesContainer, {
        target: {
            scrollTop: 832,
        },
    });

    await findByTestId('core__text-layer-3');

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);
    await findByTestId('thumbnail__list');

    let thirdThumbnailContainer = await findByTestId('thumbnail__container-2');
    mockIsIntersecting(thirdThumbnailContainer, true);

    // Rotate forward the third thumbnail
    const forwardBtn = getByTestId('rotate-forward-2');
    fireEvent.click(forwardBtn);

    // Find the third thumbnail
    const thirdThumbnailImage = await findByLabelText('Thumbnail of page 3');
    let src = thirdThumbnailImage.getAttribute('src');
    expect(src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAABkCAYAAACowvMbAAAABmJLR0QA/wD/AP+gvaeTAAAKA0lEQV'
    );
    expect(src?.length).toEqual(3542);
    expect(thirdThumbnailImage.getAttribute('height')).toEqual('100px');
    expect(thirdThumbnailImage.getAttribute('width')).toEqual('133.33333333333334px');

    // Check the size of third page
    const pageLayer = await findByTestId('core__page-layer-2');
    expect(pageLayer.style.height).toEqual('297px');
    expect(pageLayer.style.width).toEqual('396px');

    // Check if a text element is rotated
    const textLayer = await findByTestId('core__text-layer-2');
    const textElement = textLayer.childNodes[2] as HTMLElement;
    expect(textElement.textContent).toEqual('Contents');
    expect(textElement.style.left).toEqual('16.58%');
    expect(textElement.style.top).toEqual('8.83%');
});
