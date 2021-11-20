/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';

// Plugin
export interface CoverProps {
    getPageIndex?({ numPages }: { numPages: number }): number;
}

export interface RenderCurrentPageLabelProps {
    currentPage: number;
    numPages: number;
    pageIndex: number;
    pageLabel: string;
}

export type RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => React.ReactElement;

export interface RenderThumbnailProps {
    currentPage: number;
    numPages: number;
    pageIndex: number;
    renderPageLabel: React.ReactElement;
    renderPageThumbnail: React.ReactElement;
    onJumpToPage: () => void;
}

export type RenderThumbnail = (props: RenderThumbnailProps) => React.ReactElement;

export interface ThumbnailPluginProps {
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    // The spinner that replaces the default `Spinner` component
    // For example, it is displayed when loading the cover or thumbnail of a page
    renderSpinner?: () => React.ReactElement;
    renderThumbnail?: RenderThumbnail;
}

export interface ThumbnailPlugin extends Plugin {
    Cover: (props: CoverProps) => React.ReactElement;
    Thumbnails(): React.ReactElement;
}

export function thumbnailPlugin(props?: ThumbnailPluginProps): ThumbnailPlugin;
