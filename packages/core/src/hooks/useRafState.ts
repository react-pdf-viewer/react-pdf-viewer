/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsMounted } from './useIsMounted';

export const useRafState = <T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const isMounted = useIsMounted();
    const rafRef = React.useRef(0);
    const [state, setState] = React.useState(initialState);

    const setRafState = React.useCallback((value: T | ((prevState: T) => T)) => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            isMounted.current && setState(value);
        });
    }, []);

    React.useEffect(() => {
        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return [state, setRafState];
};
