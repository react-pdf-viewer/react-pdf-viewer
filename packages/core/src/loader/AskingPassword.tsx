/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import * as React from 'react';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextBox } from '../components/TextBox';
import { LocalizationContext } from '../localization/LocalizationContext';
import { PasswordStatus } from '../structs/PasswordStatus';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { type DocumentAskPasswordEvent } from '../types/DocumentAskPasswordEvent';
import { type LocalizationMap } from '../types/LocalizationMap';
import { type RenderProtectedView } from '../types/RenderProtectedView';
import { classNames } from '../utils/classNames';

export const AskingPassword: React.FC<{
    passwordStatus: PasswordStatus;
    renderProtectedView?: RenderProtectedView;
    verifyPassword: (password: string) => void;
    onDocumentAskPassword?(e: DocumentAskPasswordEvent): void;
}> = ({ passwordStatus, renderProtectedView, verifyPassword, onDocumentAskPassword }) => {
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

    if (renderProtectedView) {
        return renderProtectedView({
            passwordStatus,
            verifyPassword,
        });
    }

    return (
        <div className="rpv-core__asking-password-wrapper">
            <div
                className={classNames({
                    'rpv-core__asking-password': true,
                    'rpv-core__asking-password--rtl': isRtl,
                })}
            >
                <div className="rpv-core__asking-password-message">
                    {passwordStatus === PasswordStatus.RequiredPassword &&
                        (((l10n.core as LocalizationMap).askingPassword as LocalizationMap)
                            .requirePasswordToOpen as string)}
                    {passwordStatus === PasswordStatus.WrongPassword &&
                        (((l10n.core as LocalizationMap).wrongPassword as LocalizationMap).tryAgain as string)}
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
                        {((l10n.core as LocalizationMap).askingPassword as LocalizationMap).submit as string}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};
