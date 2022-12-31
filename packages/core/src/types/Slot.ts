/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export interface Attr extends React.HTMLAttributes<HTMLDivElement> {
    'data-testid'?: string;
    ref?: React.MutableRefObject<HTMLDivElement | null>;
}

export interface Slot {
    attrs?: Attr;
    children?: React.ReactNode;
    subSlot?: Slot;
}
