import { PasswordStatus, PrimaryButton, TextBox, Viewer, type RenderProtectedViewProps } from '@react-pdf-viewer/core';
import * as React from 'react';

const ProtectedView: React.FC<RenderProtectedViewProps> = ({ passwordStatus, verifyPassword }) => {
    const [password, setPassword] = React.useState('');
    const submit = (): void => verifyPassword(password);

    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
            }}
        >
            <div
                style={{
                    width: '20rem',
                }}
            >
                <div
                    style={{
                        marginBottom: '0.5rem',
                    }}
                >
                    <TextBox
                        placeholder="Enter the password ..."
                        testId="password-input"
                        type="password"
                        value={password}
                        onChange={setPassword}
                    />
                </div>
                {passwordStatus === PasswordStatus.WrongPassword && (
                    <div
                        data-testid="error"
                        style={{
                            color: '#c02424',
                            marginBottom: '0.5rem',
                        }}
                    >
                        The password is invalid. Please try again!
                    </div>
                )}
                <PrimaryButton testId="submit-button" onClick={submit}>
                    Submit
                </PrimaryButton>
            </div>
        </div>
    );
};

const IndexPage = () => {
    return (
        <div
            style={{
                border: '1px solid rgba(0, 0, 0, .3)',
                display: 'flex',
                height: '50rem',
                margin: '5rem auto',
                width: '64rem',
            }}
        >
            <Viewer fileUrl={'/sample-protected.pdf'} renderProtectedView={ProtectedView} />
        </div>
    );
};

export default IndexPage;
