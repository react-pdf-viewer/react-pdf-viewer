/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { LocalizationContext, type LocalizationMap } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HandToolIcon } from './HandToolIcon';
import { TextSelectionIcon } from './TextSelectionIcon';
import { SelectionMode } from './structs/SelectionMode';

interface RenderChildren {
    icon: React.ReactElement;
    label: string;
    onClick(): void;
}

export const SwitchSelectionModeDecorator: React.FC<{
    children(props: RenderChildren): React.ReactElement;
    mode: SelectionMode;
    onClick(): void;
}> = ({ children, mode, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);

    let label = '';
    let icon = <TextSelectionIcon />;

    switch (mode) {
        case SelectionMode.Hand:
            label =
                l10n && l10n.selectionMode ? ((l10n.selectionMode as LocalizationMap).handTool as string) : 'Hand tool';
            icon = <HandToolIcon />;
            break;

        case SelectionMode.Text:
        default:
            label =
                l10n && l10n.selectionMode
                    ? ((l10n.selectionMode as LocalizationMap).textSelectionTool as string)
                    : 'Text selection tool';
            icon = <TextSelectionIcon />;
            break;
    }

    return children({ icon, label, onClick });
};
