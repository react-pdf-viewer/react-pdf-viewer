/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { useEffect, useState } from 'react';
import { PdfJs, Store, StoreHandler } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';

const useDocument = (store: Store<StoreProps>): { currentDoc: PdfJs.PdfDocument } => {
    const [currentDoc, setCurrentDoc] = useState(store.get('doc'));

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return { currentDoc };
};

export default useDocument;
