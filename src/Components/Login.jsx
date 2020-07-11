import { useDispatch } from 'react-redux';
import { useState, useEffect, useContext } from 'react';
import { setInitialUser } from '../actions';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './Login.css';
import UrlContext from '../index';
import { handleFetch } from '../utils';

const Login = ({ setWaitingForUser }) => {
    const dispatch = useDispatch();
    const [usernameValue, setUsernameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [formError, setFormError] = useState(null);
    const [_user, _setUser] = useState({ user: null, waiting: false });
    const urlPrefix = useContext(UrlContext);

    const handleUsernameInput = (event) => {
        setUsernameValue(event.target.value);
    };

    const handlePasswordInput = (event) => {
        setPasswordValue(event.target.value);
    };

    useEffect(() => {
        // wrap in check for initial effect
        if (_user.user) {
            localStorage.user = JSON.stringify(_user.user);
            const userState = _user.user /* eslint-disable-line no-nested-ternary */
                ? (_user.user.verified
                && !!_user.user.battlenet_accounts
                && Object.keys(_user.user.battlenet_accounts[0].profiles).length > 0)
                : null;
            setWaitingForUser(!userState);
            dispatch(setInitialUser(_user.user, _user.user.main_race));
        }
    }, [_user]);

    const handleSubmit = async (event) => {
        // prevents form action to reload page
        event.preventDefault();
        _setUser(prevUser => ({ ...prevUser, waiting: true }));
        setFormError(false);

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
                _setUser(prevUser => ({ ...prevUser, user: loginResponse.data.user }));
            } else {
                setFormError('Something went wrong. Please try again');
                _setUser(prevUser => ({ ...prevUser, waiting: false }));
            }
        } else {
            setFormError('Incorrect details');
            _setUser(prevUser => ({ ...prevUser, waiting: false }));
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
                            disabled={_user.waiting}
                        />
                        {_user.waiting &&
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
