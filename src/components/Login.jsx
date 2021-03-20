import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { setInitialUser } from '../actions';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './Login.css';
import { URL_PREFIX } from '../constants';
import { handleFetch } from '../utils';

const Login = ({ setWaitingForUser }) => {
    const dispatch = useDispatch();
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [loginState, setLoginState] = useState({
        message: null,
        loadingState: 'initial',
    });
    const [resetPassword, setResetPassword] = useState(false);

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
    };

    const handlePasswordReset = async (event) => {
        event.preventDefault();

        const data = { username: usernameValue };
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        const response = await handleFetch(`${URL_PREFIX}api/password/reset/`, opts);
    };

    const handleSubmit = async (event) => {
        // prevents form action to reload page
        event.preventDefault();
        setLoginState({
            message: null,
            loadingState: 'inProgress',
        });

        const data = {
            username: usernameValue,
            password: passwordValue,
        };

        const loginOpts = {
            method: 'POST',
            headers: {
                'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        const loginResponse = await handleFetch(`${URL_PREFIX}api/login/`, loginOpts);

        if (loginResponse.ok) {
            if (loginResponse.data) {
                const user = loginResponse.data.user;
                localStorage.user = JSON.stringify(user);

                const userState = user /* eslint-disable-line no-nested-ternary */
                    ? (user.verified
                    && !!user.battlenet_accounts
                    && Object.keys(user.battlenet_accounts[0].profiles).length > 0)
                    : null;

                setWaitingForUser(!userState);
                dispatch(setInitialUser(user, user.main_race));
            } else {
                setLoginState({
                    message: 'Something went wrong. Please try again',
                    loadingState: 'error',
                });
            }
        } else if (loginResponse.status === 400) {
            setLoginState({
                message: 'Incorrect details',
                loadingState: 'error',
            });
        } else {
            setLoginState({
                message: 'Something went wrong',
                loadingState: 'error',
            });
        }
    };

    return (
        <div className="Login">
            {resetPassword ?
                (
                    <div className="login-form login-form--password-reset">
                        <h1 className="login-form__title login-form__title--password-reset">Password Reset</h1>
                        <h3 className="login-form__message--password-reset">
                            Enter your <span style={{ textDecoration: 'underline' }}>verified</span> email address and we will send you a password reset link
                        </h3>
                        <form className="login-form__form login-form__form--password-reset" onSubmit={handlePasswordReset} autoComplete="on">
                            <p className="login-form__email login-form__email--password-reset">
                                <label className="login-form__label login-form__label--password-reset">
                                    Email
                                </label>
                                <input
                                    className="login-form__input login-form__input--password-reset"
                                    type="email"
                                    name="username"
                                    value={usernameValue}
                                    onChange={handleUsernameInput}
                                />
                            </p>
                            <span className="login-form__flex-wrapper">
                                <input
                                    className="login-form__submit login-form__submit--password-reset"
                                    type="submit"
                                    value="RESET PASSWORD"
                                    disabled={loginState.loadingState === 'inProgress'}
                                />
                                {loginState.loadingState === 'inProgress' && <SpinningRingAnimation style={{ top: '20px' }} />}
                            </span>
                            {loginState.loadingState === 'error' &&
                                <p className="login-form__error login-form__error--password-reset">
                                    {loginState.message}
                                </p>}
                        </form>
                    </div>
                ) : (
                    <div className="login-form">
                        <h1 className="login-form__title">Welcome Back</h1>
                        <form className="login-form__form" onSubmit={handleSubmit} autoComplete="on">
                            <p className="login-form__email">
                                <label className="login-form__label">
                                    Email
                                </label>
                                <input
                                    className="login-form__input login-form__input--email"
                                    type="email"
                                    name="username"
                                    value={usernameValue}
                                    onChange={handleUsernameInput}
                                />
                            </p>
                            <p className="login-form__password">
                                <span className="login-form__wrapper">
                                    <label className="login-form__label">
                                        Password
                                    </label>
                                    <button
                                        className="login-form__label login-form__forgot-password"
                                        onClick={() => setResetPassword(true)}
                                    >
                                        Forgot password
                                    </button>
                                </span>
                                <input
                                    className="login-form__input login-form__input--password"
                                    type="password"
                                    name="password"
                                    value={passwordValue}
                                    onChange={handlePasswordInput}
                                />
                            </p>
                            <span className="login-form__flex-wrapper">
                                <input
                                    className="login-form__submit"
                                    type="submit"
                                    value="LOG IN"
                                    disabled={loginState.loadingState === 'inProgress'}
                                />
                                {loginState.loadingState === 'inProgress' && <SpinningRingAnimation style={{ top: '20px' }} />}
                            </span>
                            {loginState.loadingState === 'error' &&
                                <p className="login-form__error">
                                    {loginState.message}
                                </p>}
                        </form>
                        <img
                            className="login-image"
                            src="../images/login-background.png"
                            alt="StarCraft Races"
                        />
                    </div>
                )}
        </div>
    );
};

export default Login;
