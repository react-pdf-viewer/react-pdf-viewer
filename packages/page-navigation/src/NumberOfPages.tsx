/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Store } from '@react-pdf-viewer/core';

import { useNumberOfPages } from './useNumberOfPages';
import type { StoreProps } from './types/StoreProps';

export interface RenderNumberOfPagesProps {
    numberOfPages: number;
}

type RenderNumberOfPages = (props: RenderNumberOfPagesProps) => React.ReactElement;

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
