type StoreState = Record<string, any>;

type StoreKey<T extends StoreState> = string & keyof T;
type StoreHandler<T> = (params: T) => void;

interface Store<T extends StoreState> {
    subscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandler<T[K]>): void;
    unsubscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandler<T[K]>): void;
    update<K extends StoreKey<T>>(eventName: K, params: T[K]): void;
    get<K extends StoreKey<T>>(eventName: K): T;
}

function createStore<T extends StoreState>(initialState: T): Store<T> {
    let state: T = initialState || {} as T;

    const listeners: {
        [K in keyof StoreState]?: Array<(p: StoreState[K]) => void>;
    } = {};

    return {
        subscribe(key, handler) {
            listeners[key] = (listeners[key] || []).concat(handler);
        },
        unsubscribe(key, handler) {
            listeners[key] = (listeners[key] || []).filter(f => f !== handler);
        },
        update(key, data) {
            state = {
                ...state,
                [key]: data,
            };
            (listeners[key] || []).forEach(handler => handler(state[key]));
        },
        get(key) {
            return state[key];
        },
    };
};

export default createStore;
