import * as React from 'react';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';

const TestKeywordOption: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const searchPluginInstance = searchPlugin({
        keyword,
    });

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '720px',
                width: '720px',
            }}
        >
            <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
        </div>
    );
};

test('keyword option', async () => {
    const keyword = 'document';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__OPEN_PARAMETERS_PDF__']} keyword={keyword} />
    );
    mockIsIntersecting(getByTestId('viewer'), true);

    const page = await findByTestId('viewer-page-layer-4');
    mockIsIntersecting(page, true);

    await findByText('Parameters for Opening PDF Files');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(8);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
