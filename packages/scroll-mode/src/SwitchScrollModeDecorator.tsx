/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import { HorizontalScrollingIcon } from './HorizontalScrollingIcon';
import { ScrollMode } from './structs/ScrollMode';
import { VerticalScrollingIcon } from './VerticalScrollingIcon';
import { WrappedScrollingIcon } from './WrappedScrollingIcon';

interface RenderChildren {
    icon: React.ReactElement;
    label: string;
    onClick(): void;
}

export const SwitchScrollModeDecorator: React.FC<{
    children(props: RenderChildren): React.ReactElement;
    mode: ScrollMode;
    onClick(): void;
}> = ({ children, mode, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);

    let label = '';
    let icon = <VerticalScrollingIcon />;

    switch (mode) {
        case ScrollMode.Horizontal:
            label = (l10n && l10n.scrollMode ? l10n.scrollMode.horizontalScrolling : 'Horizontal scrolling') as string;
            icon = <HorizontalScrollingIcon />;
            break;

        case ScrollMode.Wrapped:
            label = (l10n && l10n.scrollMode ? l10n.scrollMode.wrappedScrolling : 'Wrapped scrolling') as string;
            icon = <WrappedScrollingIcon />;
            break;

        case ScrollMode.Vertical:
        default:
            label = (l10n && l10n.scrollMode ? l10n.scrollMode.verticalScrolling : 'Vertical scrolling') as string;
            icon = <VerticalScrollingIcon />;
            break;
    }

    return children({ icon, label, onClick });
};
