/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export enum Trigger {
    // It will not trigger the highlight. It is often used to render the highlight areas
    None = 'None',
    // Show the target after users select text
    TextSelection = 'TextSelection',
}
