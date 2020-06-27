import { useEffect, useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tippy from '@tippy.js/react';
import { setUser } from '../actions';
import UrlContext from '../index';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './AccountSetup.css';

const AccountSetup = ({ setWaitingForUser }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const profileInputRef = useRef();
    const [currentProfileUrl, setCurrentProfileUrl] = useState(null);
    const [isEmailSending, setIsEmailSending] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const [isProfileSaving, setIsProfileSaving] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const urlPrefix = useContext(UrlContext);

    const checkAccountStatus = async () => {
        const url = `${urlPrefix}api/authorize/check/`;

        const updatedUser = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        }).then(response => (
            response.json()
        ));
        dispatch(setUser(updatedUser.user));
        localStorage.user = JSON.stringify(updatedUser.user);
    };

    useEffect(() => {
        const setBattlenetAccount = async (authCode) => {
            const url = `${urlPrefix}api/authorize/code/`;

            const battlenetAccountResponse = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Token ${user.token}` },
                body: JSON.stringify({ authCode }),
            }).then(response => response);

            if (battlenetAccountResponse.ok) {
                localStorage.removeItem('authCode');
            }
        };

        if (localStorage.authCode) {
            setBattlenetAccount(localStorage.authCode);
        }

        checkAccountStatus();
    }, []);

    const resendEmail = async () => {
        if (user.verified) {
            return;
        }
        setIsEmailSending(true);
        setEmailError(null);
        const url = `${urlPrefix}api/resend/`;

        const emailResponse = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        });

        if (emailResponse.ok) {
            setEmailError(null);
            setIsEmailSending(null);
        } else {
            setEmailError('Something went wrong');
            setIsEmailSending(false);
        }
    };

    const authorizeBattlenetAccount = async () => {
        if (user.battlenetAccounts) {
            return;
        }
        const url = `${urlPrefix}api/authorize/url/`;

        const authorizeBattlenetResponse = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                return data;
            }
            return null;
        });

        if (authorizeBattlenetResponse) {
            window.location.assign(authorizeBattlenetResponse.url);
        }
    };

    const handleProfileUrlChange = (event) => {
        setCurrentProfileUrl(event.target.value);
    };

    const handleProfile = async (event) => {
        event.preventDefault();

        // user needs to link a battlenet account first
        // so profile can be connected to battlenet account
        if (!user.battlenetAccounts) {
            setProfileError(false);
            return;
        }

        setIsProfileSaving(true);
        setProfileError(null);
        const url = `${urlPrefix}api/profile/`;

        const profileResponse = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Token ${user.token}` },
            body: currentProfileUrl,
        });

        if (profileResponse.ok) {
            checkAccountStatus();
            setIsProfileSaving(null);
        } else if (profileResponse.status === 400) {
            setProfileError('Invalid URL');
            setIsProfileSaving(false);
        } else {
            setProfileError('An error occurred during profile parsing');
            setIsProfileSaving(false);
        }
        profileInputRef.current.value = null;
        setCurrentProfileUrl(null);
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
                    <li
                        className={`
                            AccountSetup__task-progress
                            ${user.verified ? 'AccountSetup__task-progress--completed' : ''}
                        `}
                    >
                        Email Verification
                        {user.verified &&
                            <span className="AccountSetup__completion-message">
                                Complete!
                            </span>}
                    </li>
                    <li
                        className={`
                            AccountSetup__task-progress
                            ${user.battlenetAccounts ? 'AccountSetup__task-progress--completed' : ''}
                        `}
                    >
                        Battle.net Account Link
                        {user.battlenetAccounts &&
                            <span className="AccountSetup__completion-message">
                                Complete!
                            </span>}
                    </li>
                    <li
                        className={`
                            AccountSetup__task-progress
                            ${user.battlenetAccounts && (Object.keys(user.battlenetAccounts[0].profiles).length > 0 ? 'AccountSetup__task-progress--completed' : '')}
                        `}
                    >
                        Add Profiles
                        {user.battlenetAccounts && (Object.keys(user.battlenetAccounts[0].profiles).length > 0) &&
                            <span className="AccountSetup__completion-message">
                                Complete!
                            </span>}
                    </li>
                </ul>
                {user.verified && user.battlenetAccounts && Object.keys(user.battlenetAccounts[0].profiles).length > 0 &&
                    <button
                        className="AccountSetup__setup-action AccountSetup__setup-action--finish"
                        onClick={() => setWaitingForUser(false)}
                    >
                        Continue
                    </button>}
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
                                    ${user.verified ? 'AccountSetup__status--completed' : 'AccountSetup__status--in-progress'}
                                `}
                            >
                                {user.verified ? 'Verified' : 'Waiting for verification'}
                            </span>
                        </p>
                    </span>
                    <p className="AccountSetup__instructions">
                        A verification email has been sent to&nbsp;
                        <span className="AccountSetup__email">{user.email}</span>.<br />
                        Click the link inside to verify your account, you&#39;ll be redirected back to this page.
                    </p>
                    <div className="AccountSetup__setup-action-wrapper AccountSetup__setup-action-wrapper--email">
                        <button
                            className={`
                                AccountSetup__setup-action
                                ${user.verified ? 'AccountSetup__setup-action--completed' : ''}
                            `}
                            onClick={resendEmail}
                        >
                            {user.verified ? 'Verification Complete' : 'Resend Email'}
                        </button>
                        {isEmailSending && <SpinningRingAnimation />}
                        {isEmailSending === null ?
                            <span className="AccountSetup__info AccountSetup__info--completed">
                                Email Sent
                            </span>
                            :
                            ''}
                        {emailError &&
                            <span className="AccountSetup__info AccountSetup__info--completed">
                                {emailError}
                            </span>}
                    </div>
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
                            <span
                                className={`
                                    AccountSetup__status
                                    ${user.battlenetAccounts ? 'AccountSetup__status--completed' : 'AccountSetup__status--failed'}
                                `}
                            >
                                {user.battlenetAccounts ?
                                    user.battlenetAccounts[0].battletag : 'No account found'}
                            </span>
                        </p>
                    </span>
                    <p className="AccountSetup__instructions">
                        Link your account and allow Zephyrus access to your StarCraft II profile.<br />
                        Once the authorization process is complete, you&#39;ll be redirected back to this page.
                    </p>
                    <button
                        className={`
                            AccountSetup__setup-action
                            AccountSetup__setup-action--battlenet
                            ${user.battlenetAccounts ? 'AccountSetup__setup-action--completed' : ''}
                        `}
                        onClick={authorizeBattlenetAccount}
                        // add key handler for enter
                    >
                        {user.battlenetAccounts ? 'Link Successful' : 'Link your Account'}
                    </button>
                    <Tippy
                        content={
                            <span>
                                <span>
                                    {`Linking your Battle.net account lets us identify 
                                    you in replays and associate replays with your account.`}
                                </span>
                                <br />
                                <br />
                                <span>
                                    {`We use your Battletag to associate replays 
                                    with your account and the Profile IDs 
                                    of your account in each region to identify you 
                                    in replays.`}
                                </span>
                            </span>
                        }
                        arrow
                    >
                        <p className="AccountSetup__authorize-info">
                            Why do I need to do this?
                        </p>
                    </Tippy>
                </li>
                <li className="AccountSetup__add-profiles  AccountSetup__task">
                    <span className="AccountSetup__task-header">
                        <h1 className="AccountSetup__title">
                            Add your Profiles
                        </h1>
                        <p className="AccountSetup__task-status">
                            <span className="AccountSetup__status-name">
                                Profiles
                            </span>
                            <span
                                className={`
                                    AccountSetup__status
                                    ${(user.battlenetAccounts && Object.keys(user.battlenetAccounts[0].profiles).length > 0) ? 'AccountSetup__status--completed' : 'AccountSetup__status--failed'}
                                `}
                            >
                                {user.battlenetAccounts ?
                                    Object.keys(user.battlenetAccounts[0].profiles).length : 0}
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
                    <div className="AccountSetup__setup-action-wrapper AccountSetup__setup-action-wrapper--profile">
                        <form className="AccountSetup__profile-form" onSubmit={handleProfile}>
                            <input
                                type="url"
                                ref={profileInputRef}
                                placeholder="Enter profile URL"
                                onChange={handleProfileUrlChange}
                                className="AccountSetup__profile-input"
                            />
                            <input
                                type="submit"
                                value="Save Profile"
                                className="AccountSetup__setup-action AccountSetup__save-profile"
                            />
                        </form>
                        {isProfileSaving && <SpinningRingAnimation />}
                        {isProfileSaving === null ?
                            <span className="AccountSetup__info AccountSetup__info--completed">
                                Profile Saved
                            </span>
                            :
                            ''}
                        {profileError &&
                            <span className="AccountSetup__info AccountSetup__info--completed">
                                {profileError}
                            </span>}
                        {profileError === false &&
                            <span className="AccountSetup__info AccountSetup__info--completed">
                                Link your Battle.net Account before adding a Profile
                            </span>}
                    </div>
                    {user.battlenetAccounts &&
                            Object.values(user.battlenetAccounts[0].profiles).map(profile => (
                                <p key={profile.profile_id} className="AccountSetup__profile-info">
                                    {profile.region_name}:&nbsp;
                                    {profile.profile_name} ({profile.profile_id[0]})&nbsp;
                                </p>
                            ))}
                </li>
            </ol>
            <p className="AccountSetup__message">
                Having trouble setting up your account?<br />
                Contact me on&nbsp;
                <a
                    href="https://www.reddit.com/user/ZephyrBluu/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Reddit
                </a>, Discord (ZephyrBlu#4524)
                or at&nbsp;
                <a
                    href="mailto:hello@zephyrus.gg"
                >
                    hello@zephyrus.gg
                </a>
            </p>
        </div>
    );
};

export default AccountSetup;
