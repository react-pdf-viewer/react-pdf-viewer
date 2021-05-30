/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PdfJs, Spinner, Store, StoreHandler } from '@react-pdf-viewer/core';

import AttachmentLoader from './AttachmentLoader';
import StoreProps from './StoreProps';

const AttachmentListWithStore: React.FC<{
    store: Store<StoreProps>,
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

    return (
        currentDoc 
        ? <AttachmentLoader doc={currentDoc} />
        : <div className='rpv-attachment__loader'><Spinner /></div>
    );
};

export default AttachmentListWithStore;
