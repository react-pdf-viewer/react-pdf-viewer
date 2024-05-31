/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { type Plugin } from '@react-pdf-viewer/core';
import * as React from 'react';

// Types
export interface ShowPropertiesMenuItemProps {
    onClick: () => void;
}

export interface ShowPropertiesProps {
    children?: (props: RenderShowPropertiesProps) => React.ReactElement;
}

export interface RenderShowPropertiesProps {
    onClick(): void;
}

// Plugin
export interface PropertiesPlugin extends Plugin {
    ShowProperties: (props: ShowPropertiesProps) => React.ReactElement;
    ShowPropertiesButton(): React.ReactElement;
    ShowPropertiesMenuItem: (props: ShowPropertiesMenuItemProps) => React.ReactElement;
}

export function propertiesPlugin(): PropertiesPlugin;

// Components
export class InfoIcon extends React.Component {}
