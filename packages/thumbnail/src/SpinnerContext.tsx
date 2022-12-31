/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Spinner } from '@react-pdf-viewer/core';
import * as React from 'react';

export interface SpinnerContextProps {
    renderSpinner: () => React.ReactElement;
}

export const defaultSpinner = () => <Spinner />;

export const SpinnerContext = React.createContext<SpinnerContextProps>({
    renderSpinner: defaultSpinner,
});
