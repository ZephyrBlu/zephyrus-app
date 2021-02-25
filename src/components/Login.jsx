import { useDispatch } from 'react-redux';
import React, { useState, useContext } from 'react';
import { setInitialUser } from '../actions';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './Login.css';
import UrlContext from '../index';
import { handleFetch } from '../utils';

const Login = ({ setWaitingForUser }) => {
    const dispatch = useDispatch();
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [loginState, setLoginState] = useState({
        message: null,
        loadingState: 'initial',
    });
    const urlPrefix = useContext(UrlContext);

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
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
        const loginResponse = await handleFetch(`${urlPrefix}api/login/`, loginOpts);

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
        } else {
            setLoginState({
                message: 'Incorrect details',
                loadingState: 'error',
            });
        }
    };

    return (
        <div className="Login">
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
                        <label className="login-form__label">
                            Password
                        </label>
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
        </div>
    );
};

export default Login;
