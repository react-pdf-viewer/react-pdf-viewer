/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type { Plugin, RenderViewer, Slot } from '@react-pdf-viewer/core';

import { Print, PrintProps } from './Print';
import { PrintButton } from './PrintButton';
import { PrintContainer } from './PrintContainer';
import { PrintMenuItem, PrintMenuItemProps } from './PrintMenuItem';
import { PrintStatus } from './structs/PrintStatus';
import { ShortcutHandler } from './ShortcutHandler';
import type { StoreProps } from './types/StoreProps';

export interface PrintPlugin extends Plugin {
    Print: (props: PrintProps) => React.ReactElement;
    PrintButton: () => React.ReactElement;
    PrintMenuItem: (props: PrintMenuItemProps) => React.ReactElement;
}

export interface PrintPluginProps {
    enableShortcuts?: boolean;
}

export const printPlugin = (props?: PrintPluginProps): PrintPlugin => {
    const printPluginProps = React.useMemo(() => Object.assign({}, { enableShortcuts: true }, props), []);
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                printStatus: PrintStatus.Inactive,
            }),
        []
    );

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

    const renderViewer = (props: RenderViewer): Slot => {
        const { slot } = props;
        const updateSlot: Slot = {
            children: (
                <>
                    {printPluginProps.enableShortcuts && (
                        <ShortcutHandler containerRef={props.containerRef} store={store} />
                    )}
                    <PrintContainer
                        doc={props.doc}
                        pagesRotation={props.pagesRotation}
                        pageHeight={props.pageHeight}
                        pageWidth={props.pageWidth}
                        rotation={props.rotation}
                        store={store}
                    />
                    {slot.children}
                </>
            ),
        };
        return { ...slot, ...updateSlot };
    };

    return {
        renderViewer,
        Print: PrintDecorator,
        PrintButton: PrintButtonDecorator,
        PrintMenuItem: PrintMenuItemDecorator,
    };
};
