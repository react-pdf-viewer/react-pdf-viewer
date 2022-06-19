import type { Toggle } from '@react-pdf-viewer/core';
import { Button, Modal, PrimaryButton, Viewer } from '@react-pdf-viewer/core';
import { getAllPagesNumbers, getEvenPagesNumbers, getOddPagesNumbers, printPlugin } from '@react-pdf-viewer/print';
import * as React from 'react';

enum PrintPages {
    All,
    EvenPages,
    OddPages,
    SpecificPages,
}

const IndexPage = () => {
    const printPluginInstance = printPlugin();
    const { print, setPages } = printPluginInstance;
    const [printPages, setPrintPages] = React.useState(PrintPages.All);

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
                <Modal
                    target={(toggle: Toggle) => (
                        <Button testId="print-button" onClick={toggle}>
                            Print
                        </Button>
                    )}
                    content={(toggle: Toggle) => (
                        <div style={{ padding: '1rem' }}>
                            <div style={{ marginBottom: '0.5rem ' }}>Choose pages you want to print:</div>
                            <div style={{ marginBottom: '0.5rem ' }}>
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
                            <div style={{ marginBottom: '0.5rem ' }}>
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
                            <div style={{ marginBottom: '1rem ' }}>
                                <label>
                                    <input
                                        checked={printPages === PrintPages.OddPages}
                                        type="radio"
                                        name="pages"
                                        onChange={handlePrintOddPages}
                                    />
                                    <span>Odd pages</span>
                                </label>
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
                                <PrimaryButton onClick={print}>Print</PrimaryButton>
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
                <Viewer fileUrl="/pdf-open-parameters.pdf" plugins={[printPluginInstance]} />
            </div>
        </div>
    );
};

export default IndexPage;
