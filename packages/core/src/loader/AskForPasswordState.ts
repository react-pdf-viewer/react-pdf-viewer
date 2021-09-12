/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { LoadingStatus } from './LoadingStatus';
import type { VerifyPassword } from '../types/DocumentAskPasswordEvent';

export class AskForPasswordState extends LoadingStatus {
    public verifyPassword: VerifyPassword;

    constructor(verifyPassword: VerifyPassword) {
        super();
        this.verifyPassword = verifyPassword;
    }
}
