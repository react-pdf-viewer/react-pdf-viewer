/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core/lib';

import PrintButton from './PrintButton';
import PrintStatus from './PrintStatus';
import StoreProps from './StoreProps';

export interface RenderPrintProps {
    enableShortcuts: boolean;
    onClick: () => void;
}

type RenderPrint = (props: RenderPrintProps) => React.ReactElement;

export interface PrintProps {
    children?: RenderPrint;
}

const Print: React.FC<{
    children?: RenderPrint;
    enableShortcuts: boolean;
    store: Store<StoreProps>;
}> = ({ children, enableShortcuts, store }) => {
    const print = () => {
        store.update('printStatus', PrintStatus.Preparing);
    };

    const render = children || PrintButton;

    return render({
        enableShortcuts,
        onClick: print,
    });
};

export default Print;
