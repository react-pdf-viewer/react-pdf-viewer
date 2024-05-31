/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

// Returns `true` if the code is running in Jest environment
export const isRunningInJest = () => typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
