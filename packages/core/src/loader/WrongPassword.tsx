/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2021 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { TextBox } from '../components/TextBox';
import { LocalizationContext } from '../localization/LocalizationContext';
import type { VerifyPassword } from './LoadingStatus';

export const WrongPassword: React.FC<{
    verifyPasswordFn: VerifyPassword;
}> = ({ verifyPasswordFn }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const [password, setPassword] = React.useState('');

    const submit = (): void => verifyPasswordFn(password);

    return (
        <div className="rpv-core__asking-password-wrapper">
            <div className="rpv-core__asking-password">
                <div className="rpv-core__asking-password-message">{l10n.core.wrongPassword.tryAgain}:</div>
                <div className="rpv-core__asking-password-body">
                    <div className="rpv-core__asking-password-input">
                        <TextBox type="password" value={password} onChange={setPassword} />
                    </div>
                    <button className="rpv-core__asking-password-button" onClick={submit}>
                        {l10n.core.wrongPassword.submit}
                    </button>
                </div>
            </div>
        </div>
    );
};
