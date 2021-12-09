import * as React from 'react';
import { findAllByTitle, findByText } from '@testing-library/dom';
import { fireEvent, render } from '@testing-library/react';

import { Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import type { FlagKeyword } from '../src/types/FlagKeyword';

const TestKeepHighlight: React.FC<{
    fileUrl: Uint8Array;
    keyword: string | FlagKeyword;
}> = ({ fileUrl, keyword }) => {
    const toolbarPluginInstance = toolbarPlugin({
        searchPlugin: {
            keyword,
        },
    });
    const { Toolbar } = toolbarPluginInstance;

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <div>
                <Toolbar />
            </div>
            <div style={{ flex: 1 }}>
                <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
            </div>
        </div>
    );
};

test('Keep highlighting after clicking zoom buttons in the default toolbar', async () => {
    const keyword = 'document';

    const { findByTestId, getByTestId } = render(
        <TestKeepHighlight fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />
    );

    mockIsIntersecting(getByTestId('core__viewer'), true);

    let page = await findByTestId('core__page-layer-6');
    mockIsIntersecting(page, true);

    await findByText(page, 'Adobe Acrobat SDK');
    let highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(3);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Zoom the document
    const zoomInButton = await findByTestId('zoom__in-button');
    fireEvent.click(zoomInButton);

    page = await findByTestId('core__page-layer-4');
    mockIsIntersecting(page, true);

    await findByText(page, 'Parameters for Opening PDF Files');
    highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(8);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
