/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { Breakpoint } from '../structs/Breakpoint';
import { determineBreakpoint } from './determineBreakpoint';

export const useBreakpoint = (): [React.RefCallback<HTMLElement>, Breakpoint] => {
    const [node, setNode] = React.useState<HTMLElement | null>(null);
    const [breakpoint, setBreakpoint] = React.useState(Breakpoint.ExtraSmall);

    const resizeCallback = React.useCallback<ResizeObserverCallback>((entries) => {
        entries.forEach((entry) => {
            const rect = entry.target.getBoundingClientRect();
            const breakpoint = determineBreakpoint(rect.width);
            setBreakpoint(breakpoint);
        });
    }, []);

    const ref = React.useCallback((nodeEle: HTMLElement | null) => {
        setNode(nodeEle);
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (!node) {
            return;
        }
        const resizeObserver = new ResizeObserver(resizeCallback);
        resizeObserver.observe(node);

        return () => {
            resizeObserver.disconnect();
        };
    }, [node]);

    return [ref, breakpoint];
};
