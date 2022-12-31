/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { RotateDirection } from '@react-pdf-viewer/core';
import * as React from 'react';

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
