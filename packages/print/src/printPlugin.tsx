/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs, Plugin, RenderViewer, Slot } from '@react-pdf-viewer/core';
import { createStore } from '@react-pdf-viewer/core';
import * as React from 'react';
import { Print, PrintProps } from './Print';
import { PrintButton } from './PrintButton';
import { PrintContainer } from './PrintContainer';
import { PrintMenuItem, PrintMenuItemProps } from './PrintMenuItem';
import { ShortcutHandler } from './ShortcutHandler';
import { PrintStatus } from './structs/PrintStatus';
import type { StoreProps } from './types/StoreProps';

export interface PrintPlugin extends Plugin {
    print: () => void;
    setPages: (printPages: (doc: PdfJs.PdfDocument) => number[]) => void;
    Print: (props: PrintProps) => React.ReactElement;
    PrintButton: () => React.ReactElement;
    PrintMenuItem: (props: PrintMenuItemProps) => React.ReactElement;
}

export interface PrintPluginProps {
    enableShortcuts?: boolean;
    renderProgressBar?(numLoadedPages: number, numPages: number, onCancel: () => void): React.ReactElement;
    setPages?: (doc: PdfJs.PdfDocument) => number[];
}

export const printPlugin = (props?: PrintPluginProps): PrintPlugin => {
    const printPluginProps = React.useMemo(
        () =>
            Object.assign(
                {},
                {
                    enableShortcuts: true,
                    setPages: (doc: PdfJs.PdfDocument) =>
                        Array(doc.numPages)
                            .fill(0)
                            .map((_, i) => i),
                },
                props
            ),
        []
    );
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                printStatus: PrintStatus.Inactive,
            }),
        []
    );

    const print = () => {
        store.update('printStatus', PrintStatus.CheckingPermission);
    };

    const PrintDecorator = (props: PrintProps) => (
        <Print enableShortcuts={printPluginProps.enableShortcuts} {...props} store={store} />
    );

    const PrintButtonDecorator = () => <PrintDecorator>{(props) => <PrintButton {...props} />}</PrintDecorator>;

    const PrintMenuItemDecorator = (props: PrintMenuItemProps) => (
        <PrintDecorator>
            {(p) => (
                <PrintMenuItem
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </PrintDecorator>
    );

    const renderViewer = (renderViewerProps: RenderViewer): Slot => {
        const { slot } = renderViewerProps;
        const updateSlot: Slot = {
            children: (
                <>
                    {printPluginProps.enableShortcuts && (
                        <ShortcutHandler containerRef={renderViewerProps.containerRef} store={store} />
                    )}
                    <PrintContainer
                        doc={renderViewerProps.doc}
                        pagesRotation={renderViewerProps.pagesRotation}
                        pageSizes={renderViewerProps.pageSizes}
                        renderProgressBar={props?.renderProgressBar}
                        rotation={renderViewerProps.rotation}
                        setPages={printPluginProps.setPages}
                        store={store}
                    />
                    {slot.children}
                </>
            ),
        };
        return { ...slot, ...updateSlot };
    };

    const setPages = (printPages: (doc: PdfJs.PdfDocument) => number[]): void => {
        printPluginProps.setPages = printPages;
    };

    return {
        print,
        renderViewer,
        Print: PrintDecorator,
        PrintButton: PrintButtonDecorator,
        PrintMenuItem: PrintMenuItemDecorator,
        setPages,
    };
};
