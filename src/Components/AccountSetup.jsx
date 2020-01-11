import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setUser } from '../actions';
// import SpinningRingAnimation from './General/SpinningRingAnimation';
// import InfoTooltip from './General/InfoTooltip';
import './AccountSetup.css';

const AccountSetup = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [authWindow, setAuthWindow] = useState(null);
    const [battlenetAccountCheck, setBattlenetAccountCheck] = useState(null);

    let urlPrefix;
    if (process.env.NODE_ENV === 'development') {
        urlPrefix = 'http://127.0.0.1:8000/';
    } else {
        urlPrefix = 'https://zephyrus.gg/';
    }

    const checkAccountStatus = async () => {
        const url = `${urlPrefix}api/authorize/check/`;

        const updatedUser = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Token ${user.token}`,
            },
        }).then(response => (
            response.json()
        )).catch(() => null);

        dispatch(setUser(updatedUser.user));
        clearInterval(battlenetAccountCheck);
        setBattlenetAccountCheck(null);
    };

    const setBattlenetAccount = async (authCode) => {
        const url = `${urlPrefix}api/authorize/code/`;

        const error = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Token ${user.token}`,
            },
            body: JSON.stringify({ authCode }),
        }).then((response) => {
            if (response.status !== 200) {
                return `(${response.status}) Invalid Authorization Code`;
            }
            return null;
        }).catch(() => null);

        if (error) {
            console.log(error);
        }
    };

    const authorizeBattlenetAccount = async () => {
        const url = `${urlPrefix}api/authorize/url/`;

        const result = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Token ${user.token}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            return null;
        }).then(responseBody => (
            responseBody
        )).catch(() => null);

        if (result) {
            setAuthWindow(window.open(result.url));
            setBattlenetAccountCheck(setInterval(() => {
                if (sessionStorage.authCode) {
                    authWindow.close();
                    setBattlenetAccount(sessionStorage.authCode);
                    checkAccountStatus();
                }
            }, 2000));
        }
    };

    const resendEmail = () => {
        console.log('make request to backend to resend email');
    };

    const handleProfile = (event) => {
        event.preventDefault();
        console.log('handle parsing profile');
    };

    return (
        <div className="AccountSetup">
            <section className="AccountSetup__heading">
                <h1 className="AccountSetup__main-title">
                    Lets set a few things up
                </h1>
                <h2 className="AccountSetup__tagline">
                    It only takes a couple of minutes
                </h2>
            </section>
            <div className="AccountSetup__all-task-progress">
                <h1 className="AccountSetup__title AccountSetup__title--progress">
                    Account Setup
                </h1>
                <h3 className="AccountSetup__info">
                    Your progress is saved automatically
                </h3>
                <ul className="AccountSetup__progress-list">
                    <li className="AccountSetup__task-progress AccountSetup__task-progress--completed">
                        Email Verification
                        <span className="AccountSetup__completion-message">Complete!</span>
                    </li>
                    <li className="AccountSetup__task-progress">
                        Battle.net Account Link
                    </li>
                    <li className="AccountSetup__task-progress">
                        Add Profiles
                    </li>
                </ul>
            </div>
            <ol className="AccountSetup__task-list">
                <li className="AccountSetup__verify-email AccountSetup__task">
                    <span className="AccountSetup__task-header">
                        <h1 className="AccountSetup__title">
                            Verify your Email
                        </h1>
                        <p className="AccountSetup__task-status">
                            <span className="AccountSetup__status-name">
                                Verification Status
                            </span>
                            <span
                                className={`
                                    AccountSetup__status
                                    ${user.verified ? 'AccountSetup__status--completed' : ''}
                                `}
                            >
                                {user.verified ? 'Verified' : 'Waiting for verification'}
                            </span>
                        </p>
                    </span>
                    <p className="AccountSetup__instructions">
                        A verification email has been sent to&nbsp;
                        <span className="AccountSetup__email">{user.email}</span>.<br />
                        Click the link inside to verify your account then return to this page.
                    </p>
                    <button className="AccountSetup__setup-action" onClick={resendEmail}>
                        Resend Email
                    </button>
                </li>
                <li className="AccountSetup__link-battlenet  AccountSetup__task">
                    <span className="AccountSetup__task-header">
                        <h1 className="AccountSetup__title">
                            Link your Battle.net Account
                        </h1>
                        <p className="AccountSetup__task-status">
                            <span className="AccountSetup__status-name">
                                Battle.net Account
                            </span>
                            <span className="AccountSetup__status AccountSetup__status--in-progress">
                                Link in progress
                            </span>
                        </p>
                    </span>
                    <p className="AccountSetup__instructions">
                        Link your account (Opens new tab) and
                        allow Zephyrus access to your StarCraft II profile.<br />
                        Once the authentication process is complete, the tab will close automatically.
                    </p>
                    <button
                        className="AccountSetup__setup-action"
                        onClick={authorizeBattlenetAccount}
                        // add key handler for enter
                    >
                        Link your Account
                    </button>
                </li>
                <li className="AccountSetup__add-profiles  AccountSetup__task">
                    <span className="AccountSetup__task-header">
                        <h1 className="AccountSetup__title">
                            Add your Profiles
                        </h1>
                        <p className="AccountSetup__task-status AccountSetup__task-status--failed">
                            <span className="AccountSetup__status-name">
                                Profiles
                            </span>
                            <span className="AccountSetup__status AccountSetup__status--failed">
                                {user.battlenetAccounts ?
                                    Object.keys(user.battlenetAccounts[0]).length : 0}
                                    &nbsp;Profiles saved
                            </span>
                        </p>
                    </span>
                    <p className="AccountSetup__instructions">
                        Log into&nbsp;
                        <a
                            className="AccountSetup__link"
                            href="https://starcraft2.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            starcraft2.com
                        </a>
                        &nbsp;and navigate to your profile.<br />
                        Copy the URL for each profile you want to track replays for.
                    </p>
                    <form onSubmit={handleProfile}>
                        <input
                            type="url"
                            placeholder="Enter profile URL"
                            className="AccountSetup__profile-input"
                        />
                        <input
                            type="submit"
                            value="Save Profile"
                            className="AccountSetup__setup-action AccountSetup__save-profile"
                        />
                    </form>
                </li>
            </ol>
        </div>
    );
};

export default AccountSetup;
