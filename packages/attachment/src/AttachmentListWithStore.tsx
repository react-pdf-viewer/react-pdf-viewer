/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Spinner, type PdfJs, type Store, type StoreHandler } from '@react-pdf-viewer/core';
import * as React from 'react';
import { AttachmentLoader } from './AttachmentLoader';
import { type StoreProps } from './types/StoreProps';

export const AttachmentListWithStore: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const [currentDoc, setCurrentDoc] = React.useState(store.get('doc'));

    const handleDocumentChanged: StoreHandler<PdfJs.PdfDocument> = (doc: PdfJs.PdfDocument) => {
        setCurrentDoc(doc);
    };

    React.useEffect(() => {
        store.subscribe('doc', handleDocumentChanged);

        return () => {
            store.unsubscribe('doc', handleDocumentChanged);
        };
    }, []);

    return currentDoc ? (
        <AttachmentLoader doc={currentDoc} />
    ) : (
        <div className="rpv-attachment__loader">
            <Spinner />
        </div>
    );
};
