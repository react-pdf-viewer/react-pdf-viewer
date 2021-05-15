/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

interface GoToPageMenuItemProps {
    onClick: () => void;
}

interface RenderGoToPageProps {
    isDisabled: boolean;
    onClick: () => void;
}

type RenderGoToPage = (props: RenderGoToPageProps) => React.ReactElement;

interface GoToPageProps {
    children?: RenderGoToPage;
}

export type {
    GoToPageMenuItemProps,
    GoToPageProps,
    RenderGoToPage,
    RenderGoToPageProps,
};
