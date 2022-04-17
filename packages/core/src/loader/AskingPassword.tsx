/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2022 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';

import { SubmitPassword } from './AskForPasswordState';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextBox } from '../components/TextBox';
import { LocalizationContext } from '../localization/LocalizationContext';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
import type { DocumentAskPasswordEvent, VerifyPassword } from '../types/DocumentAskPasswordEvent';
import type { LocalizationMap } from '../types/LocalizationMap';

export const AskingPassword: React.FC<{
    submitPassword: SubmitPassword;
    verifyPassword: VerifyPassword;
    onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
}> = ({ submitPassword, verifyPassword, onDocumentAskPassword }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const [password, setPassword] = React.useState('');
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;

    const submit = (): void => verifyPassword(password);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            submit();
        }
    };

    React.useEffect(() => {
        if (onDocumentAskPassword) {
            onDocumentAskPassword({
                verifyPassword,
            });
        }
    }, []);

    return (
        <div className="rpv-core__asking-password-wrapper">
            <div
                className={classNames({
                    'rpv-core__asking-password': true,
                    'rpv-core__asking-password--rtl': isRtl,
                })}
            >
                <div className="rpv-core__asking-password-message">
                    {submitPassword === SubmitPassword.REQUIRE_PASSWORD &&
                        ((l10n.core as LocalizationMap).askingPassword as LocalizationMap).requirePasswordToOpen}
                    {submitPassword === SubmitPassword.WRONG_PASSWORD &&
                        ((l10n.core as LocalizationMap).wrongPassword as LocalizationMap).tryAgain}
                </div>
                <div className="rpv-core__asking-password-body">
                    <div
                        className={classNames({
                            'rpv-core__asking-password-input': true,
                            'rpv-core__asking-password-input--ltr': !isRtl,
                            'rpv-core__asking-password-input--rtl': isRtl,
                        })}
                    >
                        <TextBox
                            testId="core__asking-password-input"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <PrimaryButton onClick={submit}>
                        {((l10n.core as LocalizationMap).askingPassword as LocalizationMap).submit}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};
