/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { LocalizationMap } from '@react-pdf-viewer/core';
import { LocalizationContext, ScrollMode } from '@react-pdf-viewer/core';
import * as React from 'react';
import { HorizontalScrollingIcon } from './HorizontalScrollingIcon';
import { PageScrollingIcon } from './PageScrollingIcon';
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
            label =
                l10n && l10n.scrollMode
                    ? ((l10n.scrollMode as LocalizationMap).horizontalScrolling as string)
                    : 'Horizontal scrolling';
            icon = <HorizontalScrollingIcon />;
            break;

        case ScrollMode.Page:
            label =
                l10n && l10n.scrollMode
                    ? ((l10n.scrollMode as LocalizationMap).pageScrolling as string)
                    : 'Page scrolling';
            icon = <PageScrollingIcon />;
            break;

        case ScrollMode.Wrapped:
            label =
                l10n && l10n.scrollMode
                    ? ((l10n.scrollMode as LocalizationMap).wrappedScrolling as string)
                    : 'Wrapped scrolling';
            icon = <WrappedScrollingIcon />;
            break;

        case ScrollMode.Vertical:
        default:
            label =
                l10n && l10n.scrollMode
                    ? ((l10n.scrollMode as LocalizationMap).verticalScrolling as string)
                    : 'Vertical scrolling';
            icon = <VerticalScrollingIcon />;
            break;
    }

    return children({ icon, label, onClick });
};
