/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PasswordStatus } from '../structs/PasswordStatus';

export interface RenderProtectedViewProps {
    passwordStatus: PasswordStatus;
    verifyPassword: (password: string) => void;
}

export type RenderProtectedView = (renderProps: RenderProtectedViewProps) => React.ReactElement;
