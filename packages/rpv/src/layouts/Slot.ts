/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React from 'react';

interface Attr extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.MutableRefObject<HTMLDivElement | null>;
}

interface SlotProps {
    attrs?: Attr;
    children?: React.ReactNode;
    outer?: React.ReactNode;
}

export type Slot = SlotProps;
export default SlotProps;
