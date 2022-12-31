/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HandToolIcon } from './HandToolIcon';
import { SelectionMode } from './structs/SelectionMode';
import { TextSelectionIcon } from './TextSelectionIcon';

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
