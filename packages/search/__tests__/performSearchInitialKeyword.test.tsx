import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';

const TestSearchPopoverInitialKeyword: React.FC<{
    fileUrl: Uint8Array;
    keyword: string;
}> = ({ fileUrl, keyword }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            searchPlugin: {
                keyword: {
                    keyword,
                    matchCase: true,
                },
            },
        },
    });

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '50rem',
                width: '64rem',
            }}
        >
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Search popover performs search based on the initial keyword', async () => {
    const { findByLabelText, findByTestId, findByText, getByTestId } = render(
        <TestSearchPopoverInitialKeyword fileUrl={global['__OPEN_PARAMS_PDF__']} keyword="PDF" />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 1024;

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

    // Find the Search button
    const searchButton = await findByLabelText('Search');
    fireEvent.click(searchButton);

    // Check if the keyword is populated properly
    let searchInput = await findByLabelText('Enter to search');
    let currentKeyword = (searchInput as HTMLInputElement).value;
    expect(currentKeyword).toEqual('PDF');

    // Check the number of matches
    let numOfMatchesLabel = await findByTestId('search__popover-num-matches');
    let numOfMatches = numOfMatchesLabel.textContent;
    expect(numOfMatches).toEqual('1/28');

    // Check if the `Match case` option is checked
    let matchCaseCheckBox = await findByTestId('search__popover-match-case');
    let isMatchCaseChecked = (matchCaseCheckBox as HTMLInputElement).checked;
    expect(isMatchCaseChecked).toEqual(true);

    // Click the `Close` button
    const closeButton = await findByText('Close');
    fireEvent.click(closeButton);

    // Open the search popover again
    fireEvent.click(searchButton);

    // Keyword is reset
    searchInput = await findByLabelText('Enter to search');
    currentKeyword = (searchInput as HTMLInputElement).value;
    expect(currentKeyword).toEqual('');

    // Check the number of matches
    numOfMatchesLabel = await findByTestId('search__popover-num-matches');
    numOfMatches = numOfMatchesLabel.textContent;
    expect(numOfMatches).toEqual('0/0');

    // The `Match case` checkbox is reset
    matchCaseCheckBox = await findByTestId('search__popover-match-case');
    isMatchCaseChecked = (matchCaseCheckBox as HTMLInputElement).checked;
    expect(isMatchCaseChecked).toEqual(false);
});
