/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { Breakpoint } from '../structs/Breakpoint';

export const BreakpointContext = React.createContext<Breakpoint>(Breakpoint.ExtraSmall);
