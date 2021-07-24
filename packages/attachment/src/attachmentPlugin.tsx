/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore, } from '@react-pdf-viewer/core';
import type { Plugin, PluginOnDocumentLoad } from '@react-pdf-viewer/core/lib';

import AttachmentListWithStore from './AttachmentListWithStore';
import StoreProps from './StoreProps';

interface AttachmentPlugin extends Plugin {
    Attachments: () => React.ReactElement;
}

const attachmentPlugin = (): AttachmentPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const AttachmentsDecorator = () => <AttachmentListWithStore store={store} />;

    return {
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        Attachments: AttachmentsDecorator,
    };
};

export default attachmentPlugin;
