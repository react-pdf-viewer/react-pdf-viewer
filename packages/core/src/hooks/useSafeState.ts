/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsMounted } from './useIsMounted';

export const useSafeState = <T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = React.useState(initialState);
    const useIsMountedRef = useIsMounted();

    const setSafeState = React.useCallback(
        (newState: React.SetStateAction<T>) => {
            if (useIsMountedRef.current) {
                setState(newState);
            }
        },
        [useIsMountedRef.current],
    );

    return [state, setSafeState];
};
