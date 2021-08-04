/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { LocalizationContext } from '@react-pdf-viewer/core';

import { SearchIcon } from './SearchIcon';

interface RenderChildren {
    icon: React.ReactElement;
    label: string;
    onClick(): void;
}

export const ShowSearchPopoverDecorator: React.FC<{
    children(props: RenderChildren): React.ReactElement;
    onClick(): void;
}> = ({ children, onClick }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const label = (l10n && l10n.search ? l10n.search.search : 'Search') as string;
    const icon = <SearchIcon />;

    return children({ icon, label, onClick });
};
