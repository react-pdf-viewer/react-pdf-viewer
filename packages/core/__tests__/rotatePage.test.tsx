import { RotateBackwardIcon, RotateForwardIcon } from '@react-pdf-viewer/rotate';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
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
} from '../src';

const TestRotatePage: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
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
                    border: '1px solid rgba(0, 0, 0, .3)',
                    display: 'flex',
                    height: '50rem',
                    margin: '5rem auto',
                    width: '64rem',
                }}
            >
                <Viewer defaultScale={0.5} fileUrl={fileUrl} renderPage={renderPage} />
            </div>
        </PdfJsApiContext.Provider>
    );
};

test('Rotate single page using renderPage', async () => {
    const { findByTestId, getByTestId } = render(<TestRotatePage fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 1022;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');

    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 798,
        width: 1022,
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
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    const forwardBtn = getByTestId('rotate-forward-2');
    fireEvent.click(forwardBtn);

    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

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
