import * as React from 'react';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';

const TestKeywordMultipleSpansOption: React.FC<{
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

test('keyword belongs to multiple spans', async () => {
    const keyword = 'anywhere can';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordMultipleSpansOption fileUrl={global['__SAMPLE_PDF__']} keyword={keyword} />
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-0');
    await findByText('Adobe Acrobat PDF Files');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(2);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
