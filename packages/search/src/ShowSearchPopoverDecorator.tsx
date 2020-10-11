/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { FC, useContext, ReactElement } from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import SearchIcon from './SearchIcon';

interface RenderChildren {
    icon: ReactElement;
    label: string;
    onClick(): void;
}

interface ShowSearchPopoverDecoratorProps {
    children(props: RenderChildren): ReactElement;
    onClick(): void;
}

const ShowSearchPopoverDecorator: FC<ShowSearchPopoverDecoratorProps> = ({ children, onClick }) => {
    const l10n = useContext(LocalizationContext);
    const label = (l10n && l10n.search ? l10n.search.search : 'Search') as string;
    const icon = <SearchIcon />;

    return children({ icon, label, onClick });
};

export default ShowSearchPopoverDecorator;
