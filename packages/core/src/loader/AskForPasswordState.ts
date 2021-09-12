/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import { LoadingStatus } from './LoadingStatus';
import type { VerifyPassword } from '../types/DocumentAskPasswordEvent';

export enum SubmitPassword {
    REQUIRE_PASSWORD,
    WRONG_PASSWORD,
}

export class AskForPasswordState extends LoadingStatus {
    public verifyPassword: VerifyPassword;
    public submitPassword: SubmitPassword;

    constructor(verifyPassword: VerifyPassword, submitPassword: SubmitPassword) {
        super();
        this.verifyPassword = verifyPassword;
        this.submitPassword = submitPassword;
    }
}
