import {
    Button,
    Modal,
    PdfJsApiContext,
    PrimaryButton,
    TextBox,
    Viewer,
    type PdfJsApiProvider,
    type Toggle,
} from '@react-pdf-viewer/core';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import * as PdfJs from 'pdfjs-dist';
import * as React from 'react';
import { mockIsIntersecting } from '../../../test-utils/mockIntersectionObserver';
import {
    getAllPagesNumbers,
    getCustomPagesNumbers,
    getEvenPagesNumbers,
    getOddPagesNumbers,
    printPlugin,
} from '../src';

enum PrintPages {
    All,
    EvenPages,
    OddPages,
    CustomPages,
}

const TestSetPagesFunction: React.FC<{
    fileUrl: Uint8Array;
}> = ({ fileUrl }) => {
    const apiProvider = PdfJs as unknown as PdfJsApiProvider;
    const printPluginInstance = printPlugin();
    const { print, setPages } = printPluginInstance;
    const [printPages, setPrintPages] = React.useState(PrintPages.All);
    const [customPages, setCustomPages] = React.useState('');
    const [customPagesInvalid, setCustomPagesInvalid] = React.useState(false);

    const handlePrintAllPages = () => {
        setPrintPages(PrintPages.All);
        setPages(getAllPagesNumbers);
    };

    const handlePrintEvenPages = () => {
        setPrintPages(PrintPages.EvenPages);
        setPages(getEvenPagesNumbers);
    };

    const handlePrintOddPages = () => {
        setPrintPages(PrintPages.OddPages);
        setPages(getOddPagesNumbers);
    };

    const handleSetCustomPages = (value: string) => {
        setCustomPages(value);
        if (!/^([0-9,-\s])+$/.test(value)) {
            setCustomPagesInvalid(true);
        } else {
            setCustomPagesInvalid(false);
            setPages(getCustomPagesNumbers(value));
        }
    };

    return (
        <PdfJsApiContext.Provider value={{ pdfJsApiProvider: apiProvider }}>
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
                    <Modal
                        target={(toggle: Toggle) => (
                            <Button testId="open-choose-pages" onClick={toggle}>
                                Print
                            </Button>
                        )}
                        content={(toggle: Toggle) => (
                            <div style={{ padding: '1rem' }} data-testid="choose-pages">
                                <div style={{ marginBottom: '0.5rem' }}>Choose pages you want to print:</div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        <input
                                            checked={printPages === PrintPages.All}
                                            type="radio"
                                            name="pages"
                                            onChange={handlePrintAllPages}
                                        />
                                        <span>All</span>
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        <input
                                            checked={printPages === PrintPages.EvenPages}
                                            type="radio"
                                            name="pages"
                                            onChange={handlePrintEvenPages}
                                        />
                                        <span>Even pages</span>
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        <input
                                            checked={printPages === PrintPages.OddPages}
                                            data-testid="odd-pages-option"
                                            type="radio"
                                            name="pages"
                                            onChange={handlePrintOddPages}
                                        />
                                        <span>Odd pages</span>
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        <input
                                            checked={printPages === PrintPages.CustomPages}
                                            type="radio"
                                            name="pages"
                                            onChange={() => setPrintPages(PrintPages.CustomPages)}
                                        />
                                        <span>Custom pages</span>
                                    </label>
                                </div>
                                <div
                                    style={{
                                        display: printPages === PrintPages.CustomPages ? 'block' : 'none',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    <TextBox
                                        value={customPages}
                                        onChange={handleSetCustomPages}
                                        placeholder="e.g, 1-5, 8, 11-13"
                                    />
                                    {customPagesInvalid && printPages === PrintPages.CustomPages && (
                                        <div
                                            style={{
                                                color: '#c02424',
                                                fontSize: '0.75rem',
                                                marginTop: '0.5rem',
                                            }}
                                        >
                                            Invalid pages
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        borderTop: '1px solid rgba(0, 0, 0, .3)',
                                        display: 'flex',
                                        justifyContent: 'end',
                                        paddingTop: '1rem',
                                    }}
                                >
                                    <div style={{ marginRight: '0.5rem' }}>
                                        <Button onClick={toggle}>Close</Button>
                                    </div>
                                    <PrimaryButton
                                        testId="print-button"
                                        onClick={() => {
                                            toggle();
                                            print();
                                        }}
                                    >
                                        Print
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}
                        closeOnClickOutside={false}
                        closeOnEscape={true}
                    />
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
        </PdfJsApiContext.Provider>
    );
};

test('Set pages with setPages() function', async () => {
    const { findByTestId, getByTestId } = render(<TestSetPagesFunction fileUrl={global['__OPEN_PARAMS_PDF__']} />);

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

    // Open the modal to choose pages
    const choosePagesButton = getByTestId('open-choose-pages');
    fireEvent.click(choosePagesButton);

    await findByTestId('choose-pages');

    const oddPagesRadio = getByTestId('odd-pages-option');
    fireEvent.click(oddPagesRadio);

    // Click the `Print` button
    const printButton = getByTestId('print-button');
    fireEvent.click(printButton);

    const printZone = await findByTestId('print__zone');

    await findByTestId('print__thumbnail-0');
    await findByTestId('print__thumbnail-2');
    await findByTestId('print__thumbnail-4');
    await findByTestId('print__thumbnail-6');
    const printPages = printZone.querySelectorAll('.rpv-print__page');
    expect(printPages.length).toEqual(4);
});
