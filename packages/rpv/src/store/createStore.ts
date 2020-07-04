type StoreState = Record<string, any>;

type StoreKey<T extends StoreState> = string & keyof T;
type StoreHandlerType<T> = (params: T) => void;

interface StoreProps<T extends StoreState> {
    subscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandlerType<NonNullable<T[K]>>): void;
    unsubscribe<K extends StoreKey<T>>(eventName: K, handler: StoreHandlerType<NonNullable<T[K]>>): void;
    update<K extends StoreKey<T>>(eventName: K, params: T[K]): void;
    get<K extends StoreKey<T>>(eventName: K): T[K];
}

function createStore<T extends StoreState>(initialState?: T): StoreProps<T> {
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

export type StoreHandler<T> = StoreHandlerType<T>;
export type Store<T> = StoreProps<T>;
export default createStore;
