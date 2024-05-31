/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://www.apache.org/licenses/LICENSE-2.0
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { LoadError } from './LoadError';
import { LoadingStatus } from './LoadingStatus';

export class FailureState extends LoadingStatus {
    public error: LoadError;

    constructor(error: LoadError) {
        super();
        this.error = error;
    }
}
