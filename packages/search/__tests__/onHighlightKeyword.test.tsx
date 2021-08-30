import * as React from 'react';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';
import type { OnHighlightKeyword } from '../src/types/OnHighlightKeyword';

const TestOnHighlightKeywordOption: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const searchPluginInstance = searchPlugin({
        keyword,
        onHighlightKeyword: (props: OnHighlightKeyword) => {
            if (props.keyword.source === keyword) {
                props.highlightEle.classList.add('custom-highlight');
            }
        },
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

test('onHighlightKeyword option', async () => {
    const keyword = 'text';

    const { findByText, findByTestId, getByTestId } = render(
        <TestOnHighlightKeywordOption fileUrl={global['__MULTIPLE_PAGES_PDF__']} keyword={keyword} />
    );
    mockIsIntersecting(getByTestId('core__viewer'), true);

    const page = await findByTestId('core__page-layer-1');
    mockIsIntersecting(page, true);

    await findByText('Simple PDF File 2');

    const highlights = await findAllByTitle(page, keyword);
    expect(highlights[0]).toHaveClass('custom-highlight');
});
