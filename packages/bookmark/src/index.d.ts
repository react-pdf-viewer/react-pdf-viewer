/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Plugin } from '@react-pdf-viewer/core';

// Plugin
export interface BookmarkPlugin extends Plugin {
    Bookmarks: () => React.ReactElement;
}

export function bookmarkPlugin(): BookmarkPlugin;

// Components
export class DownArrowIcon extends React.Component {}
export class RightArrowIcon extends React.Component {}
