import {
    MinimalButton,
    PdfJsApiContext,
    Position,
    RotateDirection,
    Tooltip,
    Viewer,
    type PdfJsApiProvider,
    type RenderPage,
    type RenderPageProps,
} from '@react-pdf-viewer/core';
import { RotateBackwardIcon, RotateForwardIcon } from '@react-pdf-viewer/rotate';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { thumbnailPlugin } from '../src';

const TestRotatePageWithThumbnails: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const thumbnailPluginInstance = thumbnailPlugin();
    const { Thumbnails } = thumbnailPluginInstance;

    const renderPage: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            <div
                style={{
                    padding: '0.25rem',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    transform: 'translate(100%, 0)',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '0 auto',
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
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    );

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
            <div
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
                    <Thumbnails />
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer
                        defaultScale={0.5}
                        fileUrl={fileUrl}
                        plugins={[thumbnailPluginInstance]}
                        renderPage={renderPage}
                    />
                </div>
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Rotate single page with thumbnails using renderPage', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestRotatePageWithThumbnails fileUrl={global['__OPEN_PARAMS_PDF__']} />,
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 818;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

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

    // Rotate forward the third page
    await waitForElementToBeRemoved(() => getByTestId('core__page-layer-loading-2'));
    const forwardBtn = getByTestId('rotate-forward-2');
    fireEvent.click(forwardBtn);

    const thumbnailsListContainer = await findByTestId('thumbnail__list-container');
    mockIsIntersecting(thumbnailsListContainer, true);

    await findByTestId('thumbnail__list');

    // Find the third thumbnail
    const thirdThumbnailContainer = await findByTestId('thumbnail__container-2');
    mockIsIntersecting(thirdThumbnailContainer, true);

    const thirdThumbnailImage = await findByLabelText('Thumbnail of page 3');
    const src = thirdThumbnailImage.getAttribute('src');
    expect(src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAABkCAYAAACowvMbAAAABmJLR0QA/wD/AP+gvaeTAAAKA0lEQV',
    );
    expect(src?.length).toEqual(3542);
    expect(thirdThumbnailImage.getAttribute('height')).toEqual('100px');
    expect(thirdThumbnailImage.getAttribute('width')).toEqual('133.33333333333334px');
});
