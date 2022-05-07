/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin } from '@react-pdf-viewer/core';
import { RotateDirection } from '@react-pdf-viewer/core';
import * as React from 'react';

// Plugin
export interface ThumbnailsProps {
    renderThumbnailItem?: RenderThumbnailItem;
}

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

export interface RenderThumbnailItemProps {
    currentPage: number;
    key: string;
    numPages: number;
    pageIndex: number;
    renderPageLabel: React.ReactElement;
    renderPageThumbnail: React.ReactElement;
    onJumpToPage: () => void;
    onRotatePage: (direction: RotateDirection) => void;
}

export type RenderThumbnailItem = (props: RenderThumbnailItemProps) => React.ReactElement;

export interface ThumbnailPluginProps {
    renderCurrentPageLabel?: RenderCurrentPageLabel;
    // The spinner that replaces the default `Spinner` component
    // For example, it is displayed when loading the cover or thumbnail of a page
    renderSpinner?: () => React.ReactElement;
    // The width of thumbnails in pixels
    thumbnailWidth?: number;
}

export interface ThumbnailPlugin extends Plugin {
    Cover: (props: CoverProps) => React.ReactElement;
    Thumbnails(props?: ThumbnailsProps): React.ReactElement;
}

export function thumbnailPlugin(props?: ThumbnailPluginProps): ThumbnailPlugin;
