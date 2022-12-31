/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Plugin } from '@react-pdf-viewer/core';
import * as React from 'react';

// Types
export interface HighlightArea {
    height: number;
    left: number;
    pageIndex: number;
    top: number;
    width: number;
}

export interface RenderHighlightContentProps {
    highlightAreas: HighlightArea[];
    previewImage: string;
    selectedText: string;
    selectionRegion: HighlightArea;
    selectionData?: SelectionData;
    cancel(): void;
}

export interface RenderHighlightsProps {
    getCssProperties(area: HighlightArea, rotation: number): React.CSSProperties;
    pageIndex: number;
    rotation: number;
}

export interface RenderHighlightTargetProps {
    highlightAreas: HighlightArea[];
    previewImage: string;
    selectedText: string;
    selectionRegion: HighlightArea;
    selectionData?: SelectionData;
    cancel(): void;
    // Switch to the hightlighting state
    toggle(): void;
}

export interface DivText {
    pageIndex: number;
    divIndex: number;
    textContent: string;
}

export interface SelectionData {
    divTexts: DivText[];
    selectedText: string;
    startPageIndex: number;
    endPageIndex: number;
    startOffset: number;
    startDivIndex: number;
    endOffset: number;
    endDivIndex: number;
}

// Structs
export enum Trigger {
    None = 'None',
    TextSelection = 'TextSelection',
}

// Plugin
export interface HighlightPlugin extends Plugin {
    jumpToHighlightArea(area: HighlightArea): void;
    switchTrigger(trigger: Trigger): void;
}

export interface HighlightPluginProps {
    renderHighlightTarget?(props: RenderHighlightTargetProps): React.ReactElement;
    renderHighlightContent?(props: RenderHighlightContentProps): React.ReactElement;
    renderHighlights?(props: RenderHighlightsProps): React.ReactElement;
    trigger?: Trigger;
}

export function highlightPlugin(props?: HighlightPluginProps): HighlightPlugin;

// Components
export class MessageIcon extends React.Component {}
