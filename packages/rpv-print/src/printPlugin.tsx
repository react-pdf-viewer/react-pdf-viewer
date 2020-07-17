/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { ReactElement } from 'react';
import { createStore, Plugin, RenderViewerProps, Slot } from '@phuocng/rpv';

import Print, { PrintProps } from './Print';
import PrintButton from './PrintButton';
import PrintContainer from './PrintContainer';
import PrintStatus from './PrintStatus';

import StoreProps from './StoreProps';

interface PrintPlugin extends Plugin {
    Print: (props: PrintProps) => ReactElement;
    PrintButton: () => ReactElement;
}

const printPlugin = (): PrintPlugin => {
    const store = createStore<StoreProps>({
        printStatus: PrintStatus.Inactive,
    });

    const PrintDecorator = (props: PrintProps) => (
        <Print {...props} store={store} />
    );

    const PrintButtonDecorator = () => (
        <PrintDecorator>
            {
                (props) => <PrintButton {...props} />
            }
        </PrintDecorator>
    );

    const renderViewer = (props: RenderViewerProps): Slot => {
        const { slot } = props;
        const updateSlot: Slot = {
            outer: (
                <>
                <PrintContainer
                    doc={props.doc}
                    pageHeight={props.pageHeight}
                    pageWidth={props.pageWidth}
                    rotation={props.rotation}
                    store={store}
                />
                {slot.outer}
                </>
            )
        };
        return {...slot, ...updateSlot};
    };

    return {
        renderViewer,
        Print: PrintDecorator,
        PrintButton: PrintButtonDecorator,
    };
};

export default printPlugin;
