/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type {
    Plugin,
    PluginFunctions,
    PluginOnDocumentLoad,
    RenderViewer,
    Slot,
    ViewerState,
} from '@react-pdf-viewer/core';
import { createStore } from '@react-pdf-viewer/core';
import * as React from 'react';
import { CurrentPageInput } from './CurrentPageInput';
import { CurrentPageLabel, CurrentPageLabelProps } from './CurrentPageLabel';
import { GoToFirstPage } from './GoToFirstPage';
import { GoToFirstPageButton } from './GoToFirstPageButton';
import { GoToFirstPageMenuItem } from './GoToFirstPageMenuItem';
import { GoToLastPage } from './GoToLastPage';
import { GoToLastPageButton } from './GoToLastPageButton';
import { GoToLastPageMenuItem } from './GoToLastPageMenuItem';
import { GoToNextPage } from './GoToNextPage';
import { GoToNextPageButton } from './GoToNextPageButton';
import { GoToNextPageMenuItem } from './GoToNextPageMenuItem';
import { GoToPreviousPage } from './GoToPreviousPage';
import { GoToPreviousPageButton } from './GoToPreviousPageButton';
import { GoToPreviousPageMenuItem } from './GoToPreviousPageMenuItem';
import { NumberOfPages, NumberOfPagesProps } from './NumberOfPages';
import { ShortcutHandler } from './ShortcutHandler';
import type { GoToPageMenuItemProps, GoToPageProps } from './types';
import type { StoreProps } from './types/StoreProps';

export interface PageNavigationPlugin extends Plugin {
    jumpToNextPage(): void;
    jumpToPage: (pageIndex: number) => void;
    jumpToPreviousPage(): void;
    CurrentPageInput: () => React.ReactElement;
    CurrentPageLabel: (props: CurrentPageLabelProps) => React.ReactElement;
    GoToFirstPage: (props: GoToPageProps) => React.ReactElement;
    GoToFirstPageButton: () => React.ReactElement;
    GoToFirstPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    GoToLastPage: (props: GoToPageProps) => React.ReactElement;
    GoToLastPageButton: () => React.ReactElement;
    GoToLastPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    GoToNextPage: (props: GoToPageProps) => React.ReactElement;
    GoToNextPageButton: () => React.ReactElement;
    GoToNextPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    GoToPreviousPage: (props: GoToPageProps) => React.ReactElement;
    GoToPreviousPageButton: () => React.ReactElement;
    GoToPreviousPageMenuItem: (props: GoToPageMenuItemProps) => React.ReactElement;
    NumberOfPages: (props: NumberOfPagesProps) => React.ReactElement;
}

export interface PageNavigationPluginProps {
    enableShortcuts?: boolean;
}

export const pageNavigationPlugin = (props?: PageNavigationPluginProps): PageNavigationPlugin => {
    const pageNavigationPluginProps = React.useMemo(() => Object.assign({}, { enableShortcuts: true }, props), []);
    const store = React.useMemo(() => createStore<StoreProps>(), []);

    const CurrentPageInputDecorator = () => <CurrentPageInput store={store} />;

    const CurrentPageLabelDecorator = (props: CurrentPageLabelProps) => <CurrentPageLabel {...props} store={store} />;

    const GoToFirstPageDecorator = (props: GoToPageProps) => <GoToFirstPage {...props} store={store} />;

    const GoToFirstPageButtonDecorator = () => (
        <GoToFirstPageDecorator>{(props) => <GoToFirstPageButton {...props} />}</GoToFirstPageDecorator>
    );

    const GoToFirstPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToFirstPageDecorator>
            {(p) => (
                <GoToFirstPageMenuItem
                    isDisabled={p.isDisabled}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </GoToFirstPageDecorator>
    );

    const GoToLastPageDecorator = (props: GoToPageProps) => <GoToLastPage {...props} store={store} />;

    const GoToLastPageButtonDecorator = () => (
        <GoToLastPageDecorator>{(props) => <GoToLastPageButton {...props} />}</GoToLastPageDecorator>
    );

    const GoToLastPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToLastPageDecorator>
            {(p) => (
                <GoToLastPageMenuItem
                    isDisabled={p.isDisabled}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </GoToLastPageDecorator>
    );

    const GoToNextPageDecorator = (props: GoToPageProps) => <GoToNextPage {...props} store={store} />;

    const GoToNextPageButtonDecorator = () => (
        <GoToNextPageDecorator>{(props) => <GoToNextPageButton {...props} />}</GoToNextPageDecorator>
    );

    const GoToNextPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToNextPageDecorator>
            {(p) => (
                <GoToNextPageMenuItem
                    isDisabled={p.isDisabled}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </GoToNextPageDecorator>
    );

    const GoToPreviousPageDecorator = (props: GoToPageProps) => <GoToPreviousPage {...props} store={store} />;

    const GoToPreviousPageButtonDecorator = () => (
        <GoToPreviousPageDecorator>{(props) => <GoToPreviousPageButton {...props} />}</GoToPreviousPageDecorator>
    );

    const GoToPreviousPageMenuItemDecorator = (props: GoToPageMenuItemProps) => (
        <GoToPreviousPageDecorator>
            {(p) => (
                <GoToPreviousPageMenuItem
                    isDisabled={p.isDisabled}
                    onClick={() => {
                        p.onClick();
                        props.onClick();
                    }}
                />
            )}
        </GoToPreviousPageDecorator>
    );

    const NumberOfPagesDecorator = (props: NumberOfPagesProps) => <NumberOfPages {...props} store={store} />;

    const renderViewer = (props: RenderViewer): Slot => {
        const { slot } = props;
        if (!pageNavigationPluginProps.enableShortcuts) {
            return slot;
        }

        const updateSlot: Slot = {
            children: (
                <>
                    <ShortcutHandler containerRef={props.containerRef} numPages={props.doc.numPages} store={store} />
                    {slot.children}
                </>
            ),
        };
        return { ...slot, ...updateSlot };
    };

    return {
        install: (pluginFunctions: PluginFunctions) => {
            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
            store.update('jumpToNextDestination', pluginFunctions.jumpToNextDestination);
            store.update('jumpToNextPage', pluginFunctions.jumpToNextPage);
            store.update('jumpToPage', pluginFunctions.jumpToPage);
            store.update('jumpToPreviousDestination', pluginFunctions.jumpToPreviousDestination);
            store.update('jumpToPreviousPage', pluginFunctions.jumpToPreviousPage);
        },
        renderViewer,
        onDocumentLoad: (props: PluginOnDocumentLoad) => {
            store.update('doc', props.doc);
            store.update('numberOfPages', props.doc.numPages);
        },
        onViewerStateChange: (viewerState: ViewerState): ViewerState => {
            store.update('currentPage', viewerState.pageIndex);
            return viewerState;
        },
        jumpToNextPage: () => {
            const jump = store.get('jumpToNextPage');
            if (jump) {
                jump();
            }
        },
        jumpToPage: (pageIndex: number) => {
            const jumpTo = store.get('jumpToPage');
            if (jumpTo) {
                jumpTo(pageIndex);
            }
        },
        jumpToPreviousPage: () => {
            const jump = store.get('jumpToPreviousPage');
            if (jump) {
                jump();
            }
        },
        CurrentPageInput: CurrentPageInputDecorator,
        CurrentPageLabel: CurrentPageLabelDecorator,
        GoToFirstPage: GoToFirstPageDecorator,
        GoToFirstPageButton: GoToFirstPageButtonDecorator,
        GoToFirstPageMenuItem: GoToFirstPageMenuItemDecorator,
        GoToLastPage: GoToLastPageDecorator,
        GoToLastPageButton: GoToLastPageButtonDecorator,
        GoToLastPageMenuItem: GoToLastPageMenuItemDecorator,
        GoToNextPage: GoToNextPageDecorator,
        GoToNextPageButton: GoToNextPageButtonDecorator,
        GoToNextPageMenuItem: GoToNextPageMenuItemDecorator,
        GoToPreviousPage: GoToPreviousPageDecorator,
        GoToPreviousPageButton: GoToPreviousPageButtonDecorator,
        GoToPreviousPageMenuItem: GoToPreviousPageMenuItemDecorator,
        NumberOfPages: NumberOfPagesDecorator,
    };
};
