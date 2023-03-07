/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { useDebounceCallback } from '../hooks/useDebounceCallback';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import type { Rect } from '../types/Rect';

const RESIZE_EVENT_OPTIONS = {
    capture: false,
    passive: true,
};

const ZERO_RECT = {
    height: 0,
    width: 0,
};

export const useWindowResize = (): Rect => {
    const [windowRect, setWindowRect] = React.useState<Rect>(ZERO_RECT);

    const handleResize = useDebounceCallback(() => {
        setWindowRect({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    }, 100);

    useIsomorphicLayoutEffect(() => {
        window.addEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);

        return () => {
            window.removeEventListener('resize', handleResize, RESIZE_EVENT_OPTIONS);
        };
    }, []);

    return windowRect;
};
