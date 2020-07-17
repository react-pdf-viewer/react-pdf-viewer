/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';
import { Store } from '@phuocng/rpv';

import PrintStatus from './PrintStatus';
import StoreProps from './StoreProps';

export interface RenderPrintProps {
    onClick: () => void;
}

export interface PrintProps {
    children: RenderPrint;
}

type RenderPrint = (props: RenderPrintProps) => React.ReactElement;

const Print: React.FC<{
    children: RenderPrint,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const print = () => {
        store.update('printStatus', PrintStatus.Preparing);
    };

    return children({
        onClick: print,
    });
};

export default Print;
