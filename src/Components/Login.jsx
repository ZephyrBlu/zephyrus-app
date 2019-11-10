import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setAuthToken, setApiKey } from '../actions';
import ProfileSection from './General/ProfileSection';
import SpinningRingAnimation from './General/SpinningRingAnimation';
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [formError, setFormError] = useState(null);
    const [isUserWaiting, setIsUserWaiting] = useState(false);

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
    };

    // update redux store with auth token
    const onGetCredentials = (newToken, apiKey) => {
        dispatch(setAuthToken(newToken));
        dispatch(setApiKey(apiKey));
        sessionStorage.token = newToken;
        sessionStorage.apiKey = apiKey;
    };

    const handleSubmit = async (event) => {
        // prevents form action to reload page
        event.preventDefault();
        setIsUserWaiting(true);

        const loginUrl = 'http://127.0.0.1:8000/api/login/';

        const data = {
            username: usernameValue,
            password: passwordValue,
        };

        const error = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        }).then(responseBody => (
            onGetCredentials(responseBody.token, responseBody.api_key)
        )).catch(requestError => (requestError));

        if (error) {
            setFormError('Incorrect details');
        }
    };

    const pageTitle = 'Login';

    const mainContent = (
        <div className="login-form">
            <form className="login-form__form" onSubmit={handleSubmit} autoComplete="on">
                {formError &&
                <p className="login-form__error">
                    {formError}
                </p>}
                <p className="login-form__email">
                    <label className="login-form__email-label">
                        Email
                        <input
                            className="login-form__email-input"
                            type="email"
                            name="username"
                            value={usernameValue}
                            onChange={handleUsernameInput}
                        />
                    </label>
                </p>
                <p className="login-form__password">
                    <label className="login-form__password-label">
                        Password
                        <input
                            className="login-form__password-input"
                            type="password"
                            name="password"
                            value={passwordValue}
                            onChange={handlePasswordInput}
                        />
                    </label>
                </p>
                <span className="login-form__flex-wrapper">
                    <input className="login-form__submit" type="submit" value="Log-in" />
                    {isUserWaiting &&
                        <SpinningRingAnimation />}
                </span>
            </form>
        </div>
    );

    return (
        <div className="Login">
            <ProfileSection
                section="Login"
                noNav
                pageTitle={pageTitle}
                mainContent={mainContent}
            />
        </div>
    );
};

export default Login;
