import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';

const TestEnterToJump: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                height: '50rem',
                width: '50rem',
            }}
        >
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </div>
    );
};

test('Press Enter to jump to the next match', async () => {
    const { findByLabelText, findByTestId, getByTestId } = render(
        <TestEnterToJump fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 800;
    viewerEle['__jsdomMockClientWidth'] = 800;

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

    // Search for "bookmarks"
    const keywordInput = await findByLabelText('Enter to search');
    fireEvent.change(keywordInput, {
        target: {
            value: 'bookmarks',
        },
    });
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });

    // Check the number of matches
    const numOfMatchesLabel = await findByTestId('search__popover-num-matches');
    expect(numOfMatchesLabel.textContent).toEqual('1/6');

    // Jump to the 2nd match
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });
    expect(numOfMatchesLabel.textContent).toEqual('2/6');

    // Jump to the 3rd match
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });
    expect(numOfMatchesLabel.textContent).toEqual('3/6');

    // Jump to the 4th match
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });
    expect(numOfMatchesLabel.textContent).toEqual('4/6');

    // Jump to the 5th match
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });
    expect(numOfMatchesLabel.textContent).toEqual('5/6');

    // Jump to the 6th match
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });
    expect(numOfMatchesLabel.textContent).toEqual('6/6');

    // Jump to the 1st match
    fireEvent.keyDown(keywordInput, {
        key: 'Enter',
    });
    expect(numOfMatchesLabel.textContent).toEqual('1/6');
});
