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
import { type StoreProps } from './types/StoreProps';
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
