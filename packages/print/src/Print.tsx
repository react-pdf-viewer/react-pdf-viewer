/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { Store } from '@react-pdf-viewer/core';

import PrintButton from './PrintButton';
import PrintStatus from './PrintStatus';
import StoreProps from './StoreProps';

export interface RenderPrintProps {
    onClick: () => void;
}

type RenderPrint = (props: RenderPrintProps) => React.ReactElement;

export interface PrintProps {
    children?: RenderPrint;
}

const Print: React.FC<{
    children?: RenderPrint,
    store: Store<StoreProps>,
}> = ({ children, store }) => {
    const print = () => {
        store.update('printStatus', PrintStatus.Preparing);
    };

    const defaultChildern = (props: RenderPrintProps) => <PrintButton onClick={props.onClick} />;
    const render = children || defaultChildern;

    return render({
        onClick: print,
    });
};

export default Print;
