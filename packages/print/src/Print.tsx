/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { type Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import { PrintButton } from './PrintButton';
import { PrintStatus } from './structs/PrintStatus';
import { type RenderPrintProps } from './types/RenderPrintProps';
import { type StoreProps } from './types/StoreProps';

type RenderPrint = (props: RenderPrintProps) => React.ReactElement;

export interface PrintProps {
    children?: RenderPrint;
}

export const Print: React.FC<{
    children?: RenderPrint;
    enableShortcuts: boolean;
    store: Store<StoreProps>;
}> = ({ children, enableShortcuts, store }) => {
    const print = () => {
        store.update('printStatus', PrintStatus.CheckingPermission);
    };

    const render = children || PrintButton;

    return render({
        enableShortcuts,
        onClick: print,
    });
};
