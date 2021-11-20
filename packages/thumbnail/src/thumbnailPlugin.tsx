/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { createStore } from '@react-pdf-viewer/core';
import type { Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@react-pdf-viewer/core';

import { Cover } from './Cover';
import { defaultSpinner, SpinnerContext } from './SpinnerContext';
import { ThumbnailListWithStore } from './ThumbnailListWithStore';
import type { CoverProps } from './types/CoverProps';
import type { RenderCurrentPageLabel } from './types/RenderCurrentPageLabelProps';
import type { StoreProps } from './types/StoreProps';

export interface ThumbnailPlugin extends Plugin {
    Cover: (props: CoverProps) => React.ReactElement;
    Thumbnails(): React.ReactElement;
}

export interface ThumbnailPluginProps {
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    // The spinner that replaces the default `Spinner` component
    // For example, it is displayed when loading the cover or thumbnail of a page
    renderSpinner?: () => React.ReactElement;
}

export const thumbnailPlugin = (pluginProps?: ThumbnailPluginProps): ThumbnailPlugin => {
    const store = React.useMemo(() => createStore<StoreProps>({}), []);

    const CoverDecorator = (props: CoverProps) => (
        <Cover {...props} renderSpinner={pluginProps?.renderSpinner} store={store} />
    );

    const ThumbnailsDecorator = () => (
        <SpinnerContext.Provider value={{ renderSpinner: pluginProps?.renderSpinner || defaultSpinner }}>
            <ThumbnailListWithStore renderCurrentPageLabel={pluginProps?.renderCurrentPageLabel} store={store} />
        </SpinnerContext.Provider>
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('currentPage', viewerState.pageIndex);
            store.update('pageHeight', viewerState.pageHeight);
            store.update('pageWidth', viewerState.pageWidth);
            return viewerState;
        },
        Cover: CoverDecorator,
        Thumbnails: ThumbnailsDecorator,
    };
};
