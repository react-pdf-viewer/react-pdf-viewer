import type { Plugin, RenderViewer } from '@react-pdf-viewer/core';
import { Button, Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
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
            height: '20rem',
            width: '20rem',
            margin: '1rem auto',
        }}
    >
        <ThumbnailCover fileUrl={fileUrl} pageIndex={pageIndex} />
    </div>
);

test('Test <Cover />', async () => {
    const { findByTestId, getByTestId } = render(<TestCover fileUrl={global['__OPEN_PARAMS_PDF__']} pageIndex={1} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 318;
    viewerEle['__jsdomMockClientWidth'] = 318;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    const coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 318;
    coverInner['__jsdomMockClientWidth'] = 318;

    const image = await findByTestId('thumbnail__cover-image');
    const src = image.getAttribute('src');
    expect(src?.length).toEqual(61722);
    expect(src?.substring(0, 100)).toEqual(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAAE+CAYAAACKpyy5AAAABmJLR0QA/wD/AP+gvaeTAAAgAElEQV'
    );
});

const TestMultipleCovers = () => {
    const pageLabelDocument = React.useMemo(
        () => new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels.pdf'))),
        []
    );

    return (
        <div>
            <TestCover fileUrl={global['__OPEN_PARAMS_PDF__']} pageIndex={0} />
            <TestCover fileUrl={pageLabelDocument} pageIndex={2} />
        </div>
    );
};

test('Test multiple <Cover />', async () => {
    const { findByTestId, findAllByTestId, getAllByTestId, getByTestId } = render(<TestMultipleCovers />);

    // Test the cover of the first document
    const viewerEleList = getAllByTestId('core__viewer');
    mockIsIntersecting(viewerEleList[0], true);
    viewerEleList[0]['__jsdomMockClientHeight'] = 318;
    viewerEleList[0]['__jsdomMockClientWidth'] = 318;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    let coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 318;
    coverInner['__jsdomMockClientWidth'] = 318;

    let image = await findByTestId('thumbnail__cover-image');
    let src = image.getAttribute('src');
    expect(src?.length).toEqual(12154);
    expect(src?.slice(-100)).toEqual(
        'IeqfHGwKoSAJVwgFSbhCKEjCFUJBEq4QCpJwhVCQhCuEgiRcIRQk4QqhIAlXCAVJuEIo6P8DgxmhOluzxw0AAAAASUVORK5CYII='
    );

    // So we can query the cover of second document
    coverInner.removeAttribute('data-testid');
    image.removeAttribute('data-testid');

    // Test the cover of the second document
    mockIsIntersecting(viewerEleList[1], true);
    viewerEleList[1]['__jsdomMockClientHeight'] = 318;
    viewerEleList[1]['__jsdomMockClientWidth'] = 318;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 318;
    coverInner['__jsdomMockClientWidth'] = 318;

    image = await findByTestId('thumbnail__cover-image');
    src = image.getAttribute('src');
    expect(src?.length).toEqual(1998);
    expect(src?.slice(-100)).toEqual(
        'ETXEiBpiRA0xooYYUUOMqCFG1BAjaogRNcSIGmJEDTGihhhRQ4yoIUbUECNqiBE1xIgaYv4DB66eMUgszcEAAAAASUVORK5CYII='
    );
});

const TestCoverDynamicDocument = () => {
    const pageLabelDocument = React.useMemo(
        () => new Uint8Array(fs.readFileSync(path.resolve(__dirname, '../../../samples/ignore/page-labels.pdf'))),
        []
    );
    const [fileUrl, setFileUrl] = React.useState(global['__OPEN_PARAMS_PDF__']);

    return (
        <div
            data-testid="root"
            style={{
                margin: '1rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    marginBottom: '1rem',
                }}
            >
                <div style={{ marginRight: '0.5rem' }}>
                    <Button testId="load-doc-1" onClick={() => setFileUrl(global['__OPEN_PARAMS_PDF__'])}>
                        Load document 1
                    </Button>
                </div>
                <Button testId="load-doc-2" onClick={() => setFileUrl(pageLabelDocument)}>
                    Load document 2
                </Button>
            </div>
            <TestCover fileUrl={fileUrl} pageIndex={2} />
        </div>
    );
};

test('Test <Cover /> with dynamic document', async () => {
    const { findByTestId, getByTestId, getByText } = render(<TestCoverDynamicDocument />);

    let viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 318;
    viewerEle['__jsdomMockClientWidth'] = 318;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    let coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 318;
    coverInner['__jsdomMockClientWidth'] = 318;

    let image = await findByTestId('thumbnail__cover-image');
    let src = image.getAttribute('src');
    expect(src?.length).toEqual(11662);
    expect(src?.slice(-100)).toEqual(
        'K2IgBVfEQAquiIEUXBEDKbgiBlJwRQyk4IoYSMEVMZCCK2IgBVfEQAquiIEUXBEDKbgiBvof61fzlJ7KkmoAAAAASUVORK5CYII='
    );

    viewerEle = await findByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 318;
    viewerEle['__jsdomMockClientWidth'] = 318;

    // Click the `Load document 2` button
    fireEvent.click(getByText('Load document 2'));

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    coverInner = await findByTestId('thumbnail__cover-inner');
    mockIsIntersecting(coverInner, true);
    coverInner['__jsdomMockClientHeight'] = 318;
    coverInner['__jsdomMockClientWidth'] = 318;

    image = await findByTestId('thumbnail__cover-image');
    src = image.getAttribute('src');
    expect(src?.length).toEqual(1998);
    expect(src?.slice(-100)).toEqual(
        'ETXEiBpiRA0xooYYUUOMqCFG1BAjaogRNcSIGmJEDTGihhhRQ4yoIUbUECNqiBE1xIgaYv4DB66eMUgszcEAAAAASUVORK5CYII='
    );
});
