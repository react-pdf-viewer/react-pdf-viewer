/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext, ReactElement } from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import HorizontalScrollingIcon from './HorizontalScrollingIcon';
import ScrollMode from './ScrollMode';
import VerticalScrollingIcon from './VerticalScrollingIcon';
import WrappedScrollingIcon from './WrappedScrollingIcon';

interface RenderChildren {
    icon: ReactElement;
    label: string;
    onClick(): void;
}

interface SwitchScrollModeDecoratorProps {
    children(props: RenderChildren): ReactElement;
    mode: ScrollMode;
    onClick(): void;
}

const SwitchScrollModeDecorator: FC<SwitchScrollModeDecoratorProps> = ({ children, mode, onClick }) => {
    const l10n = useContext(LocalizationContext);

    let label = '';
    let icon = <VerticalScrollingIcon />;

    switch (mode) {
        case ScrollMode.Horizontal:
            label = ((l10n && l10n.plugins && l10n.plugins.scrollMode)
                    ? l10n.plugins.scrollMode.horizontalScrolling
                    : 'Horizontal scrolling') as string;
            icon = <HorizontalScrollingIcon />;
            break;

        case ScrollMode.Wrapped:
            label = ((l10n && l10n.plugins && l10n.plugins.scrollMode)
                    ? l10n.plugins.scrollMode.wrappedScrolling
                    : 'Wrapped scrolling') as string;
            icon = <WrappedScrollingIcon />;
            break;

        case ScrollMode.Vertical:
        default:
            label = ((l10n && l10n.plugins && l10n.plugins.scrollMode)
                    ? l10n.plugins.scrollMode.verticalScrolling
                    : 'Vertical scrolling') as string;
            icon = <VerticalScrollingIcon />;
            break;
    }

    return children({ icon, label, onClick });
};

export default SwitchScrollModeDecorator;
