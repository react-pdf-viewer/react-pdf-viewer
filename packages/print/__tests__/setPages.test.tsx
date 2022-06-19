import { Button, Viewer } from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import { getEvenPagesNumbers, printPlugin } from '../src';

const TestSetPages: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const printPluginInstance = printPlugin({
        setPages: getEvenPagesNumbers,
    });
    const { print } = printPluginInstance;

    return (
        <div
            data-testid="root"
            style={{
                display: 'flex',
                border: '1px solid rgba(0, 0, 0, .2)',
                flexDirection: 'column',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, .2)',
                    display: 'flex',
                    padding: '0.25rem',
                }}
            >
                <Button testId="print-button" onClick={print}>
                    Print
                </Button>
            </div>
            <div
                style={{
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Viewer fileUrl={fileUrl} plugins={[printPluginInstance]} />
            </div>
        </div>
    );
};

test('Set pages', async () => {
    const { findByTestId, getByTestId } = render(<TestSetPages fileUrl={global['__OPEN_PARAMS_PDF__']} />);

    const viewerEle = getByTestId('core__viewer');
    mockIsIntersecting(viewerEle, true);
    viewerEle['__jsdomMockClientHeight'] = 757;
    viewerEle['__jsdomMockClientWidth'] = 1022;

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

    // Click the `Print` button
    const printButton = await getByTestId('print-button');
    fireEvent.click(printButton);

    const printZone = await findByTestId('print__zone');

    await findByTestId('print__thumbnail-1');
    await findByTestId('print__thumbnail-3');
    await findByTestId('print__thumbnail-5');
    await findByTestId('print__thumbnail-7');
    const printPages = printZone.querySelectorAll('.rpv-print__page');
    expect(printPages.length).toEqual(4);
});
