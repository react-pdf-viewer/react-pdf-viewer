/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export enum FullScreenMode {
    Normal = 'Normal',
    // Start entering the full screen mode
    Entering = 'Entering',
    Entered = 'Entered',
    // In the single page scroll mode, this is triggered after scrolling to the current page
    EnteredCompletely = 'EnteredCompletely',
    Exitting = 'Exitting',
    Exited = 'Exited',
}
