import { act } from '@testing-library/react';

type Item = {
    callback: ResizeObserverCallback;
    elements: Set<Element>;
    created: number;
};

// Track the `ResizeObserver` instance for each element
const observerMap = new Map<ResizeObserver, Item>();

beforeEach(() => {
    global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
        const item = {
            callback: cb,
            elements: new Set<Element>(),
            created: Date.now(),
        };
        const instance: ResizeObserver = {
            // Mock implementations
            observe: jest.fn((element: Element) => {
                item.elements.add(element);
            }),
            unobserve: jest.fn((element: Element) => {
                item.elements.delete(element);
            }),
            disconnect: jest.fn(() => {
                observerMap.delete(instance);
            }),
        };

        observerMap.set(instance, item);

        return instance;
    });
});

afterEach(() => {
    (global.ResizeObserver as any).mockClear();
    observerMap.clear();
});

const triggerResize = (elements: Element[], observer: ResizeObserver, item: Item) => {
    const entries: ResizeObserverEntry[] = [];

    elements.forEach((element) => {
        entries.push({
            borderBoxSize: [],
            contentBoxSize: [],
            contentRect: element.getBoundingClientRect(),
            devicePixelContentBoxSize: [],
            target: element,
        });
    });

    act ? act(() => item.callback(entries, observer)) : item.callback(entries, observer);
};

const mockResize = (element: Element) => {
    observerMap.forEach((item, observer) => {
        if (item.elements.has(element)) {
            triggerResize([element], observer, item);
        }
    });
};

export { mockResize };
