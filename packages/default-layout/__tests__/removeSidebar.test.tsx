import * as React from 'react';
import { render } from '@testing-library/react';
import { TextDirection, Viewer } from '@react-pdf-viewer/core';

import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestRemoveSidebar: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => [],
    });

    return (
        <div style={{ height: '720px', width: '720px' }}>
            <Viewer
                fileUrl={fileUrl}
                theme={{
                    direction: TextDirection.RightToLeft,
                }}
                plugins={[defaultLayoutPluginInstance]}
            />
        </div>
    );
};

test('Remove the sidebar', async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(
        <TestRemoveSidebar fileUrl={global['__OPEN_PARAMS_PDF__']} />
    );

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    await findByTestId('default-layout__main');

    const sidebar = queryByTestId('default-layout__sidebar');
    expect(sidebar).toBeNull();
});
