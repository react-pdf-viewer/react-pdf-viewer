import { TextDirection, Viewer } from '@react-pdf-viewer/core';
import { render } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { defaultLayoutPlugin } from '../src';

const TestRtl: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: '50rem', width: '50rem' }}>
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

test('Support RTL', async () => {
    const { findByTestId, getByTestId } = render(<TestRtl fileUrl={global['__SAMPLE_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);

    const defaultToolbar = await findByTestId('toolbar');
    expect(defaultToolbar).toHaveClass('rpv-toolbar--rtl');

    const main = await findByTestId('default-layout__main');
    expect(main).toHaveClass('rpv-default-layout__main--rtl');

    const sidebar = await findByTestId('default-layout__sidebar');
    expect(sidebar).toHaveClass('rpv-default-layout__sidebar--rtl');

    const body = await findByTestId('core__inner-pages');
    expect(body).toHaveClass('rpv-core__inner-pages--rtl');
});
