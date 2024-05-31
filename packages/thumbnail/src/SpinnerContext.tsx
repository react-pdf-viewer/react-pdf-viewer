/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import { Spinner } from '@react-pdf-viewer/core';
import * as React from 'react';

export interface SpinnerContextProps {
    renderSpinner: () => React.ReactElement;
}

export const defaultSpinner = () => <Spinner />;

export const SpinnerContext = React.createContext<SpinnerContextProps>({
    renderSpinner: defaultSpinner,
});
