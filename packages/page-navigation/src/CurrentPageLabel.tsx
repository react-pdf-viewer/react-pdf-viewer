/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useIsMounted } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import { useCurrentPage } from './useCurrentPage';
import { useDocument } from './useDocument';
import { useNumberOfPages } from './useNumberOfPages';
import type { StoreProps } from './types/StoreProps';

export interface RenderCurrentPageLabelProps {
    currentPage: number;
    numberOfPages: number;
    pageLabel: string;
}

type RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => React.ReactElement;

export interface CurrentPageLabelProps {
    children?: RenderCurrentPageLabel;
}

export const CurrentPageLabel: React.FC<{
    children?: RenderCurrentPageLabel;
    store: Store<StoreProps>;
}> = ({ children, store }) => {
    const currentDoc = useDocument(store);
    const isMounted = useIsMounted();
    const [labels, setLabels] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (currentDoc) {
            currentDoc.getPageLabels().then((result) => {
                isMounted.current && setLabels(result || []);
            });
        }
    }, [currentDoc?.loadingTask.docId]);

    const { currentPage } = useCurrentPage(store);
    const { numberOfPages } = useNumberOfPages(store);

    const defaultChildren = (props: RenderCurrentPageLabelProps) => <>{props.currentPage + 1}</>;
    const render = children || defaultChildren;

    // Check the value of `numberOfPages` to make sure the document is loaded
    const pageLabel = labels.length === numberOfPages && numberOfPages > 0 ? labels[currentPage] : '';

    return render({
        currentPage,
        numberOfPages,
        pageLabel,
    });
};
