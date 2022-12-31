/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store } from '@react-pdf-viewer/core';
import * as React from 'react';
import type { StoreProps } from './types/StoreProps';
import { useNumberOfPages } from './useNumberOfPages';

export interface RenderNumberOfPagesProps {
    numberOfPages: number;
}

export type RenderNumberOfPages = (props: RenderNumberOfPagesProps) => React.ReactElement;

export interface NumberOfPagesProps {
    children?: RenderNumberOfPages;
}

export const NumberOfPages: React.FC<{
    children?: RenderNumberOfPages;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const { numberOfPages } = useNumberOfPages(store);
    return children ? children({ numberOfPages }) : <>{numberOfPages}</>;
};
