/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { Store, StoreState } from '../types/Store';

export function createStore<T extends StoreState>(initialState?: T): Store<T> {
    let state: T = initialState || ({} as T);

    const listeners: {
        [K in keyof StoreState]?: Array<(p: StoreState[K]) => void>;
    } = {};

    return {
        subscribe(key, handler) {
            listeners[key] = (listeners[key] || []).concat(handler);
        },
        unsubscribe(key, handler) {
            listeners[key] = (listeners[key] || []).filter((f) => f !== handler);
        },
        update(key, data) {
            state = {
                ...state,
                [key]: data,
            };
            (listeners[key] || []).forEach((handler) => handler(state[key]));
        },
        get(key) {
            return state[key];
        },
    };
}
