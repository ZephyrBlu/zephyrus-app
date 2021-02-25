import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useNewLoadingState from '../hooks/useNewLoadingState';
import UrlContext from '../index';
import { handleFetch } from '../utils';
import InfoTooltip from './shared/InfoTooltip';
import LoadingState from './shared/LoadingState';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './Settings.css';

const Settings = () => {
    const urlPrefix = useContext(UrlContext);
    const user = useSelector(state => state.user);
    const battlenetAccount = user.battlenetAccounts[0];
    const [replaySummary, setReplaySummary] = useState(null);
    const [linkCount, setLinkCount] = useState(null);
    const [linkCountLoadingState, setLinkCountLoadingState] = useNewLoadingState();

    const opts = {
        method: 'GET',
        headers: { Authorization: `Token ${user.token}` },
    };

    const authorizeBattlenetAccount = async () => {
        const url = `${urlPrefix}api/authorize/url/`;
        const authorizeBattlenetResponse = await handleFetch(url, opts);

        if (authorizeBattlenetResponse.ok) {
            window.location.assign(authorizeBattlenetResponse.data.url);
        }
    };

    const linkReplays = async () => {
        const url = `${urlPrefix}api/replays/verify/`;
        setLinkCount(null);
        setLinkCountLoadingState('inProgress');
        const linkCountResponse = await handleFetch(url, opts);

        if (linkCountResponse.ok) {
            setLinkCount(linkCountResponse.data.count);
            setLinkCountLoadingState('success');
        } else {
            setLinkCount(false);
            setLinkCountLoadingState('error');
        }
    };

    useEffect(() => {
        const fetchReplaySummary = async () => {
            const url = `${urlPrefix}api/replays/summary/`;
            setReplaySummary(null);
            const summary = await handleFetch(url, opts);

            if (summary.ok) {
                setReplaySummary(summary.data);
            } else {
                setReplaySummary(false);
            }
        };
        fetchReplaySummary();
    }, []);

    return (
        <div className="Settings">
            <div className="Settings__header">
                <div className="Settings__battlenet-account">
                    <h1 className="Settings__battletag">
                        {battlenetAccount.battletag}
                    </h1>
                    <button
                        className="Settings__settings-action"
                        onClick={authorizeBattlenetAccount}
                    >
                        Link a New Account
                    </button>
                    <InfoTooltip
                        style={{ top: '8px', right: '-10px' }}
                        content={
                            <p style={{ margin: 0 }}>
                                At the moment you can only link 1
                                Battlenet Account.
                                <br />
                                <br />
                                Linking another account
                                will replace your current one.
                                <br />
                                <br />
                                You will be redirected to a Blizzard
                                approval page after clicking
                                the link button.
                                <br />
                                <br />
                                If you are already logged into a Blizzard
                                account, it may be linked automatically.
                            </p>
                        }
                    />
                </div>
                <div className="Settings__account-link-info">
                    NOTE: You may need to use a Private/Incognito window. Replays will not be affected.
                </div>
            </div>
            <div className="Settings__battlenet-profiles">
                <h1 className="Settings__section-title">
                    Battlenet Profiles
                </h1>
                {Object.entries(battlenetAccount.profiles).map(([regionId, profile]) => (
                    <div key={profile.region_name} className="Settings__battlenet-region">
                        <div className="Settings__battlenet-region-info">
                            <h2 className="Settings__region-name">
                                {profile.region_name}
                            </h2>
                            <h3 className="Settings__profile-name">
                                {profile.profile_name}
                            </h3>
                        </div>
                        {profile.profile_id.map(pId => (
                            <p key={`profile-id-${pId}`} className="Settings__battlenet-profile-id">
                                {pId}&nbsp;&nbsp;&nbsp;&nbsp;
                                <a
                                    href={`https://starcraft2.com/en-us/profile/${regionId}/${profile.realm_id}/${pId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {`https://starcraft2.com/en-us/profile/${regionId}/${profile.realm_id}/${pId}`}
                                </a>
                            </p>
                        ))}
                    </div>
                ))}
            </div>
            <div className="Settings__account-replays">
                <h1 className="Settings__section-title">
                    Account Replays
                </h1>
                <LoadingState
                    success={replaySummary}
                    error={replaySummary === false}
                    errorFallback={
                        <p className="Settings__replay-summary">
                            Something went wrong.
                        </p>
                    }
                >
                    <div className="Settings__replay-summary">
                        <div className="Settings__replay-count-wrapper">
                            <div className="Settings__replay-count">
                                {replaySummary &&
                                    replaySummary.linked + replaySummary.unlinked + replaySummary.other}
                            </div>
                            replays uploaded
                        </div>
                        <div className="Settings__replay-count-wrapper">
                            <div className="Settings__replay-count">
                                {replaySummary && replaySummary.linked}
                            </div>
                            replays linked to&nbsp;
                            <span style={{ textDecoration: 'underline', fontWeight: 400 }}>
                                {battlenetAccount.battletag}
                            </span>
                        </div>
                        {replaySummary && replaySummary.other !== 0 &&
                            <div className="Settings__replay-count-wrapper">
                                <div className="Settings__replay-count">
                                    {replaySummary.other}
                                </div>
                                replays linked to another account
                            </div>}
                        <div className="Settings__replay-count-wrapper">
                            <div className="Settings__replay-count">
                                {replaySummary && replaySummary.unlinked}
                            </div>
                            replays unlinked
                        </div>
                    </div>
                </LoadingState>
                <div className="Settings__link-replays">
                    <button
                        className="Settings__settings-action"
                        disabled={linkCountLoadingState === 'inProgress'}
                        onClick={linkReplays}
                    >
                        Link Replays
                    </button>
                    <LoadingState
                        defer
                        state={linkCountLoadingState}
                        spinner={<SpinningRingAnimation />}
                        errorFallback={null}
                        children={null}
                    />
                    <InfoTooltip
                        style={{ top: '8px', right: '-10px' }}
                        content={
                            <p style={{ margin: 0 }}>
                                Replays are linked to your Battlenet Account
                                through your Battlenet Profiles.
                                <br />
                                <br />
                                If you have unlinked replays, we will try
                                to match them to one of your Battlenet Profiles.
                                <br />
                                <br />
                                If a match is found, the replay will be linked to
                                the Battlenet Account associated with the matching profile.
                            </p>
                        }
                    />
                </div>
                <LoadingState
                    defer
                    state={linkCountLoadingState}
                    spinner={null}
                    errorFallback={
                        <p className="Settings__link-count">
                            Something went wrong.
                        </p>
                    }
                >
                    <p className="Settings__link-count">
                        Trying to link {linkCount} replays.
                        Reload this page in a couple of minutes.
                    </p>
                </LoadingState>
            </div>
        </div>
    );
};

export default Settings;
