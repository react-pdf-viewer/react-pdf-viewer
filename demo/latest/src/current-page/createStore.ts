type State = Record<string, any>;

type Key<T extends State> = string & keyof T;
type Handler<T> = (params: T) => void;

interface Store<T extends State> {
    subscribe<K extends Key<T>>(eventName: K, handler: Handler<T[K]>): void;
    unsubscribe<K extends Key<T>>(eventName: K, handler: Handler<T[K]>): void;
    update<K extends Key<T>>(eventName: K, params: T[K]): void;
    get<K extends Key<T>>(eventName: K): T;
}

function createStore<T extends State>(initialState: T): Store<T> {
    let state: T = initialState || {} as T;

    const listeners: {
        [K in keyof State]?: Array<(p: State[K]) => void>;
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
