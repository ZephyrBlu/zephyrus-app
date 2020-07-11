import { useDispatch } from 'react-redux';
import { useState, useContext } from 'react';
import useLoadingState from '../useLoadingState';
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
        data: null,
        loadingState: 'INITIAL',
    });
    const urlPrefix = useContext(UrlContext);

    const dataStates = {
        login: {
            INITIAL: null,
            IN_PROGRESS: (<SpinningRingAnimation style={{ top: '20px' }} />),
            ERROR: data => (
                <p className="login-form__error">
                    {data}
                </p>
            ),
        },
    };

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        // prevents form action to reload page
        event.preventDefault();
        setLoginState(prevState => ({
            ...prevState,
            loadingState: 'IN_PROGRESS',
        }));

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
                    data: 'Something went wrong. Please try again',
                    loadingState: 'ERROR',
                });
            }
        } else {
            setLoginState({
                data: 'Incorrect details',
                loadingState: 'ERROR',
            });
        }
    };

    const LoginState = useLoadingState(loginState, dataStates.login);

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
                            disabled={loginState.loadingState === 'IN_PROGRESS'}
                        />
                        <LoginState specifiedState="IN_PROGRESS" />
                    </span>
                    <LoginState specifiedState="ERROR" />
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
