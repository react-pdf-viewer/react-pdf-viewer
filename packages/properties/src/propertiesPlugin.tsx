/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { createStore, type Plugin, type PluginOnDocumentLoad, type ViewerState } from '@react-pdf-viewer/core';
import * as React from 'react';
import { ShowProperties, ShowPropertiesProps } from './ShowProperties';
import { ShowPropertiesMenuItem } from './ShowPropertiesMenuItem';
import { type StoreProps } from './types/StoreProps';

export interface ShowPropertiesMenuItemProps {
    onClick: () => void;
}

export interface PropertiesPlugin extends Plugin {
    ShowProperties(props: ShowPropertiesProps): React.ReactElement;
    ShowPropertiesButton(): React.ReactElement;
    ShowPropertiesMenuItem(props: ShowPropertiesMenuItemProps): React.ReactElement;
}

export const propertiesPlugin = (): PropertiesPlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                fileName: '',
            }),
        [],
    );

    const ShowPropertiesDecorator = (props: ShowPropertiesProps) => <ShowProperties {...props} store={store} />;

    const ShowPropertiesButtonDecorator = () => <ShowProperties store={store} />;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ShowPropertiesMenuItemDecorator = (props: ShowPropertiesMenuItemProps) => (
        <ShowPropertiesDecorator>{(p) => <ShowPropertiesMenuItem {...p} />}</ShowPropertiesDecorator>
    );

    return {
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('fileName', viewerState.file.name);
            return viewerState;
        },
        ShowProperties: ShowPropertiesDecorator,
        ShowPropertiesButton: ShowPropertiesButtonDecorator,
        ShowPropertiesMenuItem: ShowPropertiesMenuItemDecorator,
    };
};
