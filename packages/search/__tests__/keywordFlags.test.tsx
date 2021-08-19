import * as React from 'react';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';
import type { FlagKeyword } from '../src/types/FlagKeyword';

const TestKeywordFlag: React.FC<{
    fileUrl: Uint8Array;
    keyword: FlagKeyword;
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

test('keyword with flag matchCase=false', async () => {
    const flagKeyword = {
        keyword: 'more text',
    };

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordFlag fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={flagKeyword} />
    );
    mockIsIntersecting(getByTestId('viewer'), true);

    const page = await findByTestId('viewer-page-layer-1');
    mockIsIntersecting(page, true);

    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(12);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('keyword with flag matchCase=true', async () => {
    const flagKeyword = {
        keyword: 'More',
        matchCase: true,
    };

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordFlag fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={flagKeyword} />
    );
    mockIsIntersecting(getByTestId('viewer'), true);

    const page = await findByTestId('viewer-page-layer-1');
    mockIsIntersecting(page, true);

    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
