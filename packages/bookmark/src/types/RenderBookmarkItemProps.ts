/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { PdfJs } from '@react-pdf-viewer/core';
import * as React from 'react';

export interface RenderBookmarkItemProps {
    bookmark: PdfJs.Outline;
    depth: number;
    hasSubItems: boolean;
    isExpanded: boolean;
    onClickItem: () => void;
    onClickTitle: () => void;
    onToggleSubItems: () => void;
}

export type RenderBookmarkItem = (props: RenderBookmarkItemProps) => React.ReactElement;
