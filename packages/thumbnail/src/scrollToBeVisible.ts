/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Scroll the `ele` element if it's not visible in its scrollable `container`
const scrollToBeVisible = (ele: HTMLElement, container: HTMLElement): void => {
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    if (eleTop < containerTop) {
        // Scroll to the top of container
        container.scrollTop -= containerTop - eleTop;
    } else if (eleBottom > containerBottom) {
        // Scroll to the bottom of container
        container.scrollTop += eleBottom - containerBottom;
    }
};

export default scrollToBeVisible;
