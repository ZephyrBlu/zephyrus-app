import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setUser, setSelectedRace } from '../actions';
import SpinningRingAnimation from './General/SpinningRingAnimation';
import './Login.css';

const Login = (props) => {
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
    const onGetCredentials = (user) => {
        if (user.verified && user.battlenet_accounts && Object.keys(user.battlenet_accounts[0].profiles).length > 0) {
            props.setWaitingForUser(false);
        }
        dispatch(setUser(user));
        dispatch(setSelectedRace(user.main_race));
        localStorage.user = JSON.stringify(user);
    };

    const handleSubmit = async (event) => {
        // prevents form action to reload page
        event.preventDefault();
        setIsUserWaiting(true);
        setFormError(false);

        let urlPrefix;
        if (process.env.NODE_ENV === 'development') {
            urlPrefix = 'http://127.0.0.1:8000/';
        } else {
            urlPrefix = 'https://zephyrus.gg/';
        }

        const loginUrl = `${urlPrefix}api/login/`;

        const data = {
            username: usernameValue,
            password: passwordValue,
        };

        const result = await fetch(loginUrl, {
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
            onGetCredentials(responseBody.user)
        )).catch(requestError => (requestError));

        if (result) {
            setFormError('Incorrect details');
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
                        <input className="login-form__submit" type="submit" value="LOG IN" />
                        {isUserWaiting &&
                            <SpinningRingAnimation style={{ top: '20px' }} />}
                    </span>
                    {formError &&
                        <p className="login-form__error">
                            {formError}
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
