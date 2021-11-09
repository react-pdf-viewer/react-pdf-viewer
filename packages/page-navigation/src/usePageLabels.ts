/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core';

import type { StoreProps } from './types/StoreProps';

export const usePageLabels = (store: Store<StoreProps>): React.MutableRefObject<string[]> => {
    const labelsRef = React.useRef<string[]>([]);

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        doc.getPageLabels().then((labels) => {
            labelsRef.current = labels;
        });
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return labelsRef;
};
