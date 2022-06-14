import { Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { mockResize } from '../../../test-utils/mockResizeObserver';
import { searchPlugin } from '../src';

const TestCustomSearchControl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const searchPluginInstance = searchPlugin();
    const { Search } = searchPluginInstance;

    return (
        <div>
            <div>
                <Search>
                    {(renderSearchProps) => (
                        <input
                            data-testid="custom-search-input"
                            type="text"
                            value={renderSearchProps.keyword}
                            onChange={(e) => {
                                renderSearchProps.setKeyword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && renderSearchProps.keyword) {
                                    renderSearchProps.search();
                                }
                            }}
                        />
                    )}
                </Search>
            </div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, .3)',
                    height: '50rem',
                    width: '50rem',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </div>
    );
};

test('Custom Search control has to be rendered', async () => {
    const { findByTestId, getByTestId } = render(<TestCustomSearchControl fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 798;
    viewerEle['__jsdomMockClientWidth'] = 798;

    // Wait until the document is loaded completely
    await waitForElementToBeRemoved(() => getByTestId('core__doc-loading'));
    await findByTestId('core__text-layer-0');
    await findByTestId('core__text-layer-1');
    await findByTestId('core__text-layer-2');

    const pagesContainer = await findByTestId('core__inner-pages');
    pagesContainer.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        height: 798,
        width: 798,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        toJSON: () => {},
    }));
    mockResize(pagesContainer);

    const customSearchInput = await findByTestId('custom-search-input');
    fireEvent.change(customSearchInput, { target: { value: 'PDF' } });

    expect((customSearchInput as HTMLInputElement).value).toEqual('PDF');
});
