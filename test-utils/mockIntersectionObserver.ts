// Based on https://github.com/thebuilder/react-intersection-observer/blob/master/src/test-utils.ts

// See https://testing-library.com/docs/react-testing-library/api#act
import { act } from '@testing-library/react';

type Item = {
    callback: IntersectionObserverCallback;
    elements: Set<Element>;
    created: number;
};

// Track the `IntersectionObserver` instance for each element
const observerMap = new Map<IntersectionObserver, Item>();

beforeEach(() => {
    global.IntersectionObserver = jest.fn(
        (cb: IntersectionObserverCallback, options: IntersectionObserverInit = {}) => {
            const item = {
                callback: cb,
                elements: new Set<Element>(),
                created: Date.now(),
            };
            const instance: IntersectionObserver = {
                thresholds: Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0],
                root: options.root ?? null,
                rootMargin: options.rootMargin ?? '',
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
                takeRecords: jest.fn(),
            };

            observerMap.set(instance, item);

            return instance;
        }
    );
});

afterEach(() => {
    (global.IntersectionObserver as any).mockClear();
    observerMap.clear();
});

const triggerIntersection = (
    elements: Element[],
    trigger: boolean | number,
    observer: IntersectionObserver,
    item: Item
) => {
    const entries: IntersectionObserverEntry[] = [];

    const isIntersecting =
        typeof trigger === 'number' ? observer.thresholds.some((threshold) => trigger >= threshold) : trigger;

    const ratio =
        typeof trigger === 'number'
            ? observer.thresholds.find((threshold) => trigger >= threshold) ?? 0
            : trigger
            ? 1
            : 0;

    elements.forEach((element) => {
        entries.push({
            boundingClientRect: element.getBoundingClientRect(),
            intersectionRatio: ratio,
            intersectionRect: isIntersecting
                ? element.getBoundingClientRect()
                : {
                      bottom: 0,
                      height: 0,
                      left: 0,
                      right: 0,
                      top: 0,
                      width: 0,
                      x: 0,
                      y: 0,
                      toJSON(): any {},
                  },
            isIntersecting,
            // To get rid of `Property 'getBoundingClientRect' does not exist on type 'Document'` error
            rootBounds:
                observer.root && observer.root['getBoundingClientRect']
                    ? observer.root['getBoundingClientRect']()
                    : null,
            target: element,
            time: Date.now() - item.created,
        });
    });

    act ? act(() => item.callback(entries, observer)) : item.callback(entries, observer);
};

const mockAllIsIntersecting = (isIntersecting: boolean | number) => {
    observerMap.forEach((item, observer) => {
        triggerIntersection(Array.from(item.elements), isIntersecting, observer, item);
    });
};

const mockIsIntersecting = (element: Element, isIntersecting: boolean | number) => {
    observerMap.forEach((item, observer) => {
        if (item.elements.has(element)) {
            triggerIntersection([element], isIntersecting, observer, item);
        }
    });
};

export { mockAllIsIntersecting, mockIsIntersecting };
