/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

enum Api {
    ExitFullScreen,
    FullScreenChange,
    FullScreenElement,
    FullScreenEnabled,
    RequestFullScreen,
}

type ApiMap = { [key in keyof typeof Api]: string };

// We don't need check for Firefox browser prefix (moz)
// because the APIs are standard from Firefox 65
// See https://www.fxsitecompat.dev/en-CA/docs/2018/fullscreen-api-has-been-unprefixed/
const defaultVendor: ApiMap = {
    ExitFullScreen: 'exitFullscreen',
    FullScreenChange: 'fullscreenchange',
    FullScreenElement: 'fullscreenElement',
    FullScreenEnabled: 'fullscreenEnabled',
    RequestFullScreen: 'requestFullscreen',
}

const webkitVendor: ApiMap = {
    ExitFullScreen: 'webkitExitFullscreen',
    FullScreenChange: 'webkitfullscreenchange',
    FullScreenElement: 'webkitFullscreenElement',
    FullScreenEnabled: 'webkitFullscreenEnabled',
    RequestFullScreen: 'webkitRequestFullscreen',
};

const msVendor: ApiMap = {
    ExitFullScreen: 'msExitFullscreen',
    FullScreenChange: 'MSFullscreenChange',
    FullScreenElement: 'msFullscreenElement',
    FullScreenEnabled: 'msFullscreenEnabled',
    RequestFullScreen: 'msRequestFullscreen',
};

const vendor: ApiMap = (
    (Api.FullScreenEnabled in document && defaultVendor) ||
    (webkitVendor.FullScreenEnabled in document && webkitVendor) ||
    (msVendor.FullScreenEnabled in document && msVendor) ||
    defaultVendor
);

const addFullScreenChangeListener = (handler: () => void) => {
    document.addEventListener(vendor.FullScreenChange, handler);
};

const removeFullScreenChangeListener = (handler: () => void) => {
    document.removeEventListener(vendor.FullScreenChange, handler);
};

const exitFullScreen = (element: Element | Document): Promise<void> => {
    return (element as any)[vendor.ExitFullScreen]();
};

const getFullScreenElement = (): Element => {
    return (document as any)[vendor.FullScreenElement];
};

const requestFullScreen = (element: Element) => {
    (element as any)[vendor.RequestFullScreen]();
};

export {
    addFullScreenChangeListener,
    exitFullScreen,
    getFullScreenElement,
    removeFullScreenChangeListener,
    requestFullScreen,
};
