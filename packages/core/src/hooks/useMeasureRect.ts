/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import type { Rect } from '../types/Rect';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

const rectReducer = (
    state: Rect,
    action: {
        rect: Rect;
    }
) => {
    const rect = action.rect;
    return state.height !== rect.height || state.width !== rect.width ? rect : state;
};

export const useMeasureRect = ({ elementRef }: { elementRef: React.MutableRefObject<HTMLDivElement> }): Rect => {
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
            const { height, width } = element.getBoundingClientRect();
            dispatch({
                rect: { height, width },
            });
        }
    }, [element]);

    React.useEffect(() => {
        if (!element) {
            return;
        }
        const tracker = new ResizeObserver((entries: ResizeObserverEntry[], __: ResizeObserver) => {
            entries.forEach((entry) => {
                if (entry.target === element) {
                    const { height, width } = entry.contentRect;
                    dispatch({
                        rect: { height, width },
                    });
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
