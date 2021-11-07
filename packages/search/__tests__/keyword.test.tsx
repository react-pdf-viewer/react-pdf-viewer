import * as React from 'react';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';
import type { FlagKeyword } from '../src/types/FlagKeyword';

const TestKeywordOption: React.FC<{
    fileUrl: Uint8Array;
    keyword: string | FlagKeyword;
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
    const keyword = 'text';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={keyword} />
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-1');
    mockIsIntersecting(page, true);

    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(13);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('Special character in the keyword', async () => {
    const keyword = '(a';

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={keyword} />
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-4');
    mockIsIntersecting(page, true);

    await findByText('Parameters for Opening PDF Files');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual(keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('Match case of special character', async () => {
    const flagKeyword = {
        keyword: '(A',
        matchCase: true,
    };

    const { findByText, findByTestId, getByTestId } = render(
        <TestKeywordOption fileUrl={global['__OPEN_PARAMS_PDF__']} keyword={flagKeyword} />
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-5');
    mockIsIntersecting(page, true);

    await findByText('Adobe Acrobat SDK');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
