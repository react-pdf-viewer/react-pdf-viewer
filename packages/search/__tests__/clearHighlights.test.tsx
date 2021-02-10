const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { findAllByTitle, getAllByTitle } from '@testing-library/dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';
import SingleKeyword from '../src/types/SingleKeyword';

const TestClearHighlights: React.FC<{
    fileUrl: Uint8Array,
    keywords: SingleKeyword[],
}> = ({ fileUrl, keywords }) => {
    const searchPluginInstance = searchPlugin();
    const { clearHighlights, highlight } = searchPluginInstance;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    marginBottom: '16px',
                }}
            >
                <button
                    style={{ marginRight: '8px' }}
                    onClick={() => highlight(keywords)}
                >
                    Highlight keywords
                </button>
                <button
                    style={{ marginRight: '8px' }}
                    onClick={() => clearHighlights()}
                >
                    Clear highlights
                </button>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '720px',
                    width: '720px',
                }}
            >
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[
                        searchPluginInstance,
                    ]}
                />
            </div>
        </div>
    );
};

test('clearHighlights() method', async () => {
    const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/pdf-open-parameters.pdf'));

    const keywords = [
        'document',
        {
            keyword: 'PDF',
            matchCase: true,
        },
    ];

    const { findByText, findAllByTestId, findByTestId, getByTestId } = render(<TestClearHighlights fileUrl={new Uint8Array(rawSamplePdf)} keywords={keywords} />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const highlightButton = await screen.findByText('Highlight keywords');
    fireEvent.click(highlightButton);
    
    const page = await findByTestId('viewer-page-layer-4');
    mockIsIntersecting(page, true);
    
    await findByText('Parameters for Opening PDF Files');

    // Found 8 texts that match `document`
    let highlights = await findAllByTitle(page, 'document');
    expect(highlights.length).toEqual(8);

    // Click the `Clear highlights` button
    const clearButton = await screen.findByText('Clear highlights');
    fireEvent.click(clearButton);

    expect(page.querySelectorAll('.rpv-search-text-highlight').length).toEqual(0);
});
