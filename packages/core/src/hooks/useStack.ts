/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

export const useStack = <T>(maxLength: number) => {
    const stackRef = React.useRef<T[]>([]);

    // Add an item to the stack
    const add = (item: T): void => {
        const stack = stackRef.current;
        if (stack.length + 1 > maxLength) {
            stack.shift();
        }
        stack.push(item);
        stackRef.current = stack;
    };

    // Get the last item
    const last = (): T | null => {
        const size = stackRef.current.length;
        return size === 0 ? null : stackRef.current[size - 1];
    };

    // Remove the last item
    const pop = (): T | null => {
        const stack = stackRef.current;
        const size = stack.length;
        if (size === 0) {
            return null;
        }
        const lastItem = stack.pop();
        stackRef.current = stack;
        return lastItem;
    };

    const map = <V>(transformer: (item: T) => V): V[] => {
        return stackRef.current.map((item) => transformer(item));
    };

    React.useEffect(() => {
        return () => {
            // Clear the stack
            stackRef.current = [];
        };
    }, []);

    return {
        add,
        last,
        map,
        pop,
    };
};
