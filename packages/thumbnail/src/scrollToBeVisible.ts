/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Scroll the `ele` element if it's not visible in its scrollable `container`
const scrollToBeVisible = (ele: HTMLElement, container: HTMLElement): void => {
    // Calculate the distance from top of element to the top side of container
    const top =
        ele.getBoundingClientRect().top - container.getBoundingClientRect().top;
    const eleHeight = ele.clientHeight;
    const containerHeight = container.clientHeight;

    // 1) Must scroll to the top to see the element
    //      ┌───────────────┐
    //      |               |
    // ┌────┼───────────────┼───────┐
    // |    |               |       |
    // |    |               |       |
    // |    └───────────────┘       |
    // |                            |
    // |                            |
    // └────────────────────────────┘
    if (top < 0) {
        container.scrollTop += top;
        return;
    }

    // 2) Element is visible completely within the container
    // ┌────────────────────────────┐
    // |                            |
    // |    ┌───────────────┐       |
    // |    |               |       |
    // |    |               |       |
    // |    |               |       |
    // |    |               |       |
    // |    └───────────────┘       |
    // |                            |
    // └────────────────────────────┘
    if (top + eleHeight <= containerHeight) {
        return;
    }

    // 3) Must scroll to the bottom to see the element
    // ┌────────────────────────────┐
    // |                            |
    // |                            |
    // |                            |
    // |                            |
    // |    ┌───────────────┐       |
    // |    |               |       |
    // |    |               |       |
    // └────┼───────────────┼───────┘
    //      |               |
    //      └───────────────┘
    container.scrollTop += top + eleHeight - containerHeight;
};

export default scrollToBeVisible;
