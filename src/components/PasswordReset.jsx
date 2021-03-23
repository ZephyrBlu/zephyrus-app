import React, { useState } from 'react';
import { useLocation, navigate } from '@reach/router';
import { handleFetch } from '../utils';
import { URL_PREFIX } from '../constants';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './PasswordReset.css';

const PasswordReset = ({ resetKey }) => {
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordState, setPasswordState] = useState({
        message: null,
        loadingState: 'initial',
    });

    const sessionKey = new URLSearchParams(useLocation().search).get('session');

    const handlePassword1Input = (event) => {
        setPassword1(event.target.value);
    };

    const handlePassword2Input = (event) => {
        setPassword2(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password1 !== password2) {
            setPasswordState({
                message: 'Passwords do not match',
                loadingState: 'error',
            });
            return;
        }

        setPasswordState({
            message: null,
            loadingState: 'inProgress',
        });

        const data = {
            password1,
            password2,
            sessionKey,
        };

        const opts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
        const response = await handleFetch(
            `${URL_PREFIX}api/password/reset/key/${resetKey}/`,
            opts,
        );

        if (response.ok) {
            setPasswordState({
                message: 'Successfully reset password. Redirecting to Login page',
                loadingState: 'success',
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else if (response.status === 400) {
            setPasswordState({
                message: 'Please enter your password twice',
                loadingState: 'error',
            });
        } else if (response.status === 401) {
            setPasswordState({
                message: 'Invalid reset. Try resetting your password again',
                loadingState: 'error',
            });
        } else {
            setPasswordState({
                message: 'Something went wrong',
                loadingState: 'error',
            });
        }
    };

    return (
        <div className="PasswordReset">
            <div className="PasswordReset__form-wrapper">
                <h1 className="PasswordReset__title">
                    Change Password
                </h1>
                <h3 className="PasswordReset__message">
                    Enter your new password
                </h3>
                <form className="PasswordReset__form" onSubmit={handleSubmit} autoComplete="on">
                    <p className="PasswordReset__password">
                        <span className="PasswordReset__wrapper">
                            <label className="PasswordReset__form-label">
                                Password
                            </label>
                        </span>
                        <input
                            className="PasswordReset__form-input"
                            type="password"
                            name="password"
                            value={password1}
                            onChange={handlePassword1Input}
                        />
                    </p>
                    <p className="PasswordReset__password">
                        <span className="PasswordReset__wrapper">
                            <label className="PasswordReset__form-label">
                                Re-enter Password
                            </label>
                        </span>
                        <input
                            className="PasswordReset__form-input"
                            type="password"
                            name="password"
                            value={password2}
                            onChange={handlePassword2Input}
                        />
                    </p>
                    <span className="PasswordReset__flex-wrapper">
                        <input
                            className="PasswordReset__submit"
                            type="submit"
                            value="RESET PASSWORD"
                            disabled={passwordState.loadingState === 'inProgress'}
                        />
                        {passwordState.loadingState === 'inProgress' && <SpinningRingAnimation style={{ top: '20px' }} />}
                    </span>
                    {passwordState.loadingState === 'error' &&
                        <p className="PasswordReset__error">
                            {passwordState.message}
                        </p>}
                    {passwordState.loadingState === 'success' &&
                        <p className="PasswordReset__success">
                            {passwordState.message}
                        </p>}
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
