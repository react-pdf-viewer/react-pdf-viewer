/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export interface HighlightArea {
    height: number;
    left: number;
    pageIndex: number;
    top: number;
    width: number;
}

export interface SelectionData {
    startPageIndex: number;
    endPageIndex: number;
    startOffset: number;
    startDivIndex: number;
    endOffset: number;
    endDivIndex: number;
}

export interface RenderHighlightTargetProps {
    highlightAreas: HighlightArea[];
    selectedText: string;
    selectionRegion: HighlightArea;
    selectionData: SelectionData;
    cancel(): void;
    // Switch to the hightlighting state
    toggle(): void;
}

export interface RenderHighlightContentProps {
    highlightAreas: HighlightArea[];
    selectedText: string;
    selectionRegion: HighlightArea;
    selectionData: SelectionData;
    cancel(): void;
}

export interface RenderHighlightsProps {
    pageIndex: number;
}

export interface HighlightPlugin extends Plugin {
    jumpToHighlightArea(area: HighlightArea): void;
}

export interface HighlightPluginProps {
    renderHighlightTarget?(props: RenderHighlightTargetProps): ReactElement;
    renderHighlightContent?(props: RenderHighlightContentProps): ReactElement;
    renderHighlights?(props: RenderHighlightsProps): ReactElement;
}

export function highlightPlugin(props?: HighlightPluginProps): HighlightPlugin;
export class MessageIcon extends Component {}
