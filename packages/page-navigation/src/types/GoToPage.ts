/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
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
