/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PasswordStatus } from '../structs/PasswordStatus';

export interface RenderProtectedViewProps {
    passwordStatus: PasswordStatus;
    verifyPassword: (password: string) => void;
}

export type RenderProtectedView = (renderProps: RenderProtectedViewProps) => React.ReactElement;
