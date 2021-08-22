import * as React from 'react';
import { findAllByTitle, getAllByTitle, queryAllByTitle } from '@testing-library/dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';
import type { SingleKeyword } from '../src/types/SingleKeyword';

const TestSetTargetPages: React.FC<{
    fileUrl: Uint8Array;
    keywords: SingleKeyword[];
}> = ({ fileUrl, keywords }) => {
    const searchPluginInstance = searchPlugin();
    const { highlight, setTargetPages } = searchPluginInstance;

    // Only search in the second page
    setTargetPages((targetPage) => targetPage.pageIndex === 1);

    return (
        <div>
            <div style={{ marginRight: '8px' }}>
                <button onClick={() => highlight(keywords)}>Highlight keywords</button>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '720px',
                    width: '720px',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </div>
    );
};

test('setTargetPages() method', async () => {
    const keywords = [
        'text',
        {
            keyword: 'Boring',
            matchCase: true,
        },
    ];

    const { findByText, findByTestId, getByTestId } = render(
        <TestSetTargetPages fileUrl={global['__MULTIPLE_PAGES_PDF__']} keywords={keywords} />
    );
    mockIsIntersecting(getByTestId('viewer'), true);

    const highlightButton = await screen.findByText('Highlight keywords');
    fireEvent.click(highlightButton);

    // There is no result on the first page because we ignore it
    const firstPage = await findByTestId('viewer-page-layer-0');
    mockIsIntersecting(firstPage, true);
    await findByText('A Simple PDF File');

    let highlights = queryAllByTitle(firstPage, 'text');
    expect(highlights.length).toEqual(0);

    // Search on the second page
    const secondPage = await findByTestId('viewer-page-layer-1');
    mockIsIntersecting(secondPage, true);

    await findByText('Simple PDF File 2');

    // Found 13 texts that match `text`
    highlights = await findAllByTitle(secondPage, 'text');
    expect(highlights.length).toEqual(13);
    expect(highlights[0].getAttribute('title')).toEqual('text');
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    // Found 1 text that match `Boring`
    highlights = getAllByTitle(secondPage, 'Boring');
    expect(highlights.length).toEqual(1);
    expect(highlights[0].getAttribute('title')).toEqual('Boring');
    expect(highlights[0]).toHaveClass('rpv-search__highlight');

    expect(secondPage.querySelectorAll('.rpv-search__highlight[title="text"]').length).toEqual(13);
});
