import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { Viewer } from '@react-pdf-viewer/core';
import { searchPlugin } from '../src/index';

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
                    height: '720px',
                    width: '720px',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[searchPluginInstance]} />
            </div>
        </div>
    );
};

test('Custom Search control has to be rendered', async () => {
    const { findByTestId, getByTestId } = render(<TestCustomSearchControl fileUrl={global.__SAMPLE_PDF__} />);
    mockIsIntersecting(getByTestId('viewer'), true);

    const customSearchInput = await findByTestId('custom-search-input');
    fireEvent.change(customSearchInput, { target: { value: 'PDF' } });

    expect((customSearchInput as HTMLInputElement).value).toEqual('PDF');
});
