/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export interface GoToPageMenuItemProps {
    onClick: () => void;
}

export interface RenderGoToPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

export type RenderGoToPage = (props: RenderGoToPageProps) => React.ReactElement;

export interface GoToPageProps {
    children?: RenderGoToPage;
}
