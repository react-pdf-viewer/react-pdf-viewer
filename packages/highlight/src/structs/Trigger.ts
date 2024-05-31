/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export enum Trigger {
    // It will not trigger the highlight. It is often used to render the highlight areas
    None = 'None',
    // Show the target after users select text
    TextSelection = 'TextSelection',
}
