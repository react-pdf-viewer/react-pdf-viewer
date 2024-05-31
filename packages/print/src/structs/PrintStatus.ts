/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

export enum PrintStatus {
    CheckingPermission = 'CheckingPermission',
    Inactive = 'Inactive',
    Preparing = 'Preparing',
    Cancelled = 'Cancelled',
    Ready = 'Ready',
}
