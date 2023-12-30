/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';

export const StackContext = React.createContext<{
    currentIndex: number;
    decreaseNumStacks: () => void;
    increaseNumStacks: () => void;
    numStacks: number;
}>({
    currentIndex: 0,
    decreaseNumStacks: () => {},
    increaseNumStacks: () => {},
    numStacks: 0,
});
