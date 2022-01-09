/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export interface Size {
    height: number;
    width: number;
}

const rectReducer = (
    state: Size,
    action: {
        rect: Size;
    }
) => {
    const rect = action.rect;
    return state.height !== rect.height || state.width !== rect.width ? rect : state;
};

export const useMeasureRect = ({ elementRef }: { elementRef: React.MutableRefObject<HTMLDivElement> }): Size => {
    const [element, setElement] = React.useState(elementRef.current);
    const initializedRectRef = React.useRef(false);
    const [rect, dispatch] = React.useReducer(rectReducer, { height: 0, width: 0 });

    useIsomorphicLayoutEffect(() => {
        if (elementRef.current !== element) {
            setElement(elementRef.current);
        }
    });

    useIsomorphicLayoutEffect(() => {
        if (element && !initializedRectRef.current) {
            initializedRectRef.current = true;
            dispatch({ rect: element.getBoundingClientRect() });
        }
    }, [element]);

    React.useEffect(() => {
        if (!element) {
            return;
        }
        const tracker = new ResizeObserver((entries: ResizeObserverEntry[], __: ResizeObserver) => {
            entries.forEach((entry) => {
                if (entry.target === element) {
                    dispatch({ rect: entry.contentRect });
                }
            });
        });
        tracker.observe(element);

        return () => {
            tracker.unobserve(element);
        };
    }, [element]);

    return rect;
};
