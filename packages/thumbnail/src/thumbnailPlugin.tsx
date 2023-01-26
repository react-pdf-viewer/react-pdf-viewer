/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin, PluginFunctions, PluginOnDocumentLoad, ViewerState } from '@react-pdf-viewer/core';
import { createStore, ViewMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { Cover } from './Cover';
import { defaultSpinner, SpinnerContext } from './SpinnerContext';
import { ThumbnailDirection } from './structs/ThumbnailDirection';
import { ThumbnailListWithStore } from './ThumbnailListWithStore';
import type { CoverProps } from './types/CoverProps';
import type { RenderCurrentPageLabel } from './types/RenderCurrentPageLabelProps';
import type { RenderThumbnailItem } from './types/RenderThumbnailItemProps';
import type { StoreProps } from './types/StoreProps';

export interface ThumbnailsProps {
    renderThumbnailItem?: RenderThumbnailItem;
    thumbnailDirection?: ThumbnailDirection;
}

export interface ThumbnailPlugin extends Plugin {
    Cover: (props: CoverProps) => React.ReactElement;
    Thumbnails(props?: ThumbnailsProps): React.ReactElement;
}

export interface ThumbnailPluginProps {
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    // The spinner that replaces the default `Spinner` component
    // For example, it is displayed when loading the cover or thumbnail of a page
    renderSpinner?: () => React.ReactElement;
    // The width of thumbnails in pixels
    thumbnailWidth?: number;
}

export const thumbnailPlugin = (pluginProps?: ThumbnailPluginProps): ThumbnailPlugin => {
    const store = React.useMemo(
        () =>
            createStore<StoreProps>({
                rotatePage: () => {
                    /**/
                },
                viewMode: ViewMode.SinglePage,
            }),
        []
    );
    const [docId, setDocId] = React.useState('');

    const CoverDecorator = (props: CoverProps) => (
        <Cover {...props} renderSpinner={pluginProps?.renderSpinner} store={store} />
    );

    const ThumbnailsDecorator = React.useCallback(
        (props?: ThumbnailsProps) => (
            <SpinnerContext.Provider value={{ renderSpinner: pluginProps?.renderSpinner || defaultSpinner }}>
                <ThumbnailListWithStore
                    renderCurrentPageLabel={pluginProps?.renderCurrentPageLabel}
                    renderThumbnailItem={props?.renderThumbnailItem}
                    store={store}
                    thumbnailDirection={props?.thumbnailDirection || ThumbnailDirection.Vertical}
                    thumbnailWidth={pluginProps?.thumbnailWidth || 100}
                />
            </SpinnerContext.Provider>
        ),
        [docId]
    );

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('rotatePage', pluginFunctions.rotatePage);
        },
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            setDocId(props.doc.loadingTask.docId);
            store.update('doc', props.doc);
        },
        onViewerStateChange: (viewerState: ViewerState) => {
            store.update('currentPage', viewerState.pageIndex);
            store.update('pagesRotation', viewerState.pagesRotation);
            store.update('pageHeight', viewerState.pageHeight);
            store.update('pageWidth', viewerState.pageWidth);
            store.update('rotation', viewerState.rotation);
            store.update('rotatedPage', viewerState.rotatedPage);
            store.update('viewMode', viewerState.viewMode);
            return viewerState;
        },
        Cover: CoverDecorator,
        Thumbnails: ThumbnailsDecorator,
    };
};
