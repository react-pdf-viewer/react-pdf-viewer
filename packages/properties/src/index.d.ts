/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Component, ReactElement } from 'react';
import { Plugin } from '@react-pdf-viewer/core';

export interface ShowPropertiesMenuItemProps {
    onClick: () => void;
}

export interface RenderShowPropertiesProps {
    onClick(): void;
}

export interface ShowPropertiesProps {
    children?: (props: RenderShowPropertiesProps) => ReactElement;
}

export interface PropertiesPlugin extends Plugin {
    ShowProperties: (props: ShowPropertiesProps) => ReactElement;
    ShowPropertiesButton(): ReactElement;
    ShowPropertiesMenuItem: (props: ShowPropertiesMenuItemProps) => ReactElement;
}

export function propertiesPlugin(): PropertiesPlugin;

export class InfoIcon extends Component {}
