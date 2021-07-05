const fs = require('fs');
const path = require('path');

import * as React from 'react';
import { findAllByTitle } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';
import FlagKeyword from '../src/types/FlagKeyword';

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
    const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/pdf-open-parameters.pdf'));

    const flagKeyword = {
        keyword: 'PDF',
    };

    const { findByText, findAllByTestId, findByTestId, getByTestId } = render(
        <TestKeywordFlag fileUrl={new Uint8Array(rawSamplePdf)} keyword={flagKeyword} />
    );
    mockIsIntersecting(getByTestId('viewer'), true);

    const page = await findByTestId('viewer-page-layer-7');
    mockIsIntersecting(page, true);

    await findByText('URL examples');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(13);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});

test('keyword with flag matchCase=true', async () => {
    const rawSamplePdf = fs.readFileSync(path.resolve(__dirname, '../../../assets/pdf-open-parameters.pdf'));

    const flagKeyword = {
        keyword: 'PDF',
        matchCase: true,
    };

    const { findByText, findAllByTestId, findByTestId, getByTestId } = render(
        <TestKeywordFlag fileUrl={new Uint8Array(rawSamplePdf)} keyword={flagKeyword} />
    );
    mockIsIntersecting(getByTestId('viewer'), true);

    const page = await findByTestId('viewer-page-layer-7');
    mockIsIntersecting(page, true);

    await findByText('URL examples');

    const highlights = await findAllByTitle(page, flagKeyword.keyword);
    expect(highlights.length).toEqual(2);
    expect(highlights[0].getAttribute('title')).toEqual(flagKeyword.keyword);
    expect(highlights[0]).toHaveClass('rpv-search__highlight');
});
