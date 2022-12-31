/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

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
