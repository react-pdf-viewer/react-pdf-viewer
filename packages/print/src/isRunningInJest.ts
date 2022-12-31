/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Returns `true` if the code is running in Jest environment
export const isRunningInJest = () => typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
