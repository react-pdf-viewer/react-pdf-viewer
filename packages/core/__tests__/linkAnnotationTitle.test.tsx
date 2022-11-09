import { render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '../src';

const TestSetLinkAnnotationTitle: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => (
    <div style={{ height: '50rem', width: '50rem' }}>
        <Viewer fileUrl={fileUrl} />
    </div>
);

test('Set title for link annotations', async () => {
    const { findByTestId, getByTestId } = render(
        <TestSetLinkAnnotationTitle fileUrl={new Uint8Array(global['__OPEN_PARAMS_PDF__'])} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));

    await findByTestId('core__text-layer-0');
    await findByTestId('core__annotation-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__annotation-layer-1');
    await findByTestId('core__text-layer-2');
    await findByTestId('core__annotation-layer-2');
    await findByTestId('core__text-layer-3');
    await findByTestId('core__annotation-layer-3');

    // Check the title of the `Preface` link
    let linkContainer = await findByTestId('core__annotation--link-31R');
    let link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('Preface');
    expect(link?.getAttribute('aria-label')).toEqual('Preface');

    // Check the title of the `Who should read this guide?` link
    linkContainer = await findByTestId('core__annotation--link-37R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('Who should read this guide?');
    expect(link?.getAttribute('aria-label')).toEqual('Who should read this guide?');

    // Check the title of the `Related documentation` link
    linkContainer = await findByTestId('core__annotation--link-38R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('Related documentation');
    expect(link?.getAttribute('aria-label')).toEqual('Related documentation');

    // Check the title of the `Parameters for Opening PDF Files` link
    linkContainer = await findByTestId('core__annotation--link-39R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('Parameters for Opening PDF Files');
    expect(link?.getAttribute('aria-label')).toEqual('Parameters for Opening PDF Files');

    // Check the title of the `Parameters` link
    linkContainer = await findByTestId('core__annotation--link-34R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('Parameters');
    expect(link?.getAttribute('aria-label')).toEqual('Parameters');

    // Check the title of the `Specifying parameters in a URL` link
    linkContainer = await findByTestId('core__annotation--link-35R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('Specifying parameters in a URL');
    expect(link?.getAttribute('aria-label')).toEqual('Specifying parameters in a URL');

    // Check the title of the `URL examples` link
    linkContainer = await findByTestId('core__annotation--link-36R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('URL examples');
    expect(link?.getAttribute('aria-label')).toEqual('URL examples');

    // Check the title of the `URL limitations` link
    linkContainer = await findByTestId('core__annotation--link-33R');
    link = linkContainer.querySelector('a');
    expect(link?.getAttribute('title')).toEqual('URL limitations');
    expect(link?.getAttribute('aria-label')).toEqual('URL limitations');
});
