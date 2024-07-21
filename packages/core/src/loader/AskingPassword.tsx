/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextBox } from '../components/TextBox';
import { LocalizationContext } from '../localization/LocalizationContext';
import { PasswordStatus } from '../structs/PasswordStatus';
import styles from '../styles/askingPassword.module.css';
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
        <div className={styles.container}>
            <div
                className={classNames({
                    [styles.inner]: true,
                    [styles.innerRtl]: isRtl,
                })}
            >
                <div className={styles.message}>
                    {passwordStatus === PasswordStatus.RequiredPassword &&
                        (((l10n.core as LocalizationMap).askingPassword as LocalizationMap)
                            .requirePasswordToOpen as string)}
                    {passwordStatus === PasswordStatus.WrongPassword &&
                        (((l10n.core as LocalizationMap).wrongPassword as LocalizationMap).tryAgain as string)}
                </div>
                <div className={styles.body}>
                    <div
                        className={classNames({
                            [styles.input]: true,
                            [styles.inputLtr]: !isRtl,
                            [styles.inputRtl]: isRtl,
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
