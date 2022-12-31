/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import type { Store, StoreKey, StoreState } from '../types/Store';

export function createStore<T extends StoreState>(initialState?: T): Store<T> {
    let state: T = initialState || ({} as T);

    const listeners: {
        [K in keyof StoreState]?: Array<(p: StoreState[K]) => void>;
    } = {};

    const update = <K extends StoreKey<T>>(key: K, data: T[K]) => {
        state = {
            ...state,
            [key]: data,
        };
        (listeners[key] || []).forEach((handler) => handler(state[key]));
    };

    const get = <K extends StoreKey<T>>(key: K) => state[key];

    return {
        subscribe(key, handler) {
            listeners[key] = (listeners[key] || []).concat(handler);
        },
        unsubscribe(key, handler) {
            listeners[key] = (listeners[key] || []).filter((f) => f !== handler);
        },
        update(key, data) {
            update(key, data);
        },
        updateCurrentValue(key, updater) {
            const currentValue = get(key);
            if (currentValue !== undefined) {
                update(key, updater(currentValue));
            }
        },
        get(key) {
            return get(key);
        },
    };
}
