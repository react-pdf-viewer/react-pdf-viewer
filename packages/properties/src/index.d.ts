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
    icon: ReactElement;
    label: string;
    onClick(): void;
}

export interface ShowPropertiesProps {
    children?: (props: RenderShowPropertiesProps) => ReactElement;
}

export interface PropertiesPlugin extends Plugin {
    ShowProperties: (props: ShowPropertiesProps) => ReactElement;
    ShowPropertiesMenuItem: (props: ShowPropertiesMenuItemProps) => ReactElement;
}

export default function propertiesPlugin(): PropertiesPlugin;

export class InfoIcon extends Component {}
