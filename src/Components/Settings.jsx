import { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UrlContext from '../index';
import InfoTooltip from './shared/InfoTooltip';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './Settings.css';

const Settings = () => {
    const urlPrefix = useContext(UrlContext);
    const user = useSelector(state => state.user);
    const battlenetAccount = user.battlenetAccounts[0];
    const [replaySummary, setReplaySummary] = useState(null);
    const [linkCount, setLinkCount] = useState(null);

    const authorizeBattlenetAccount = async () => {
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

    const linkReplays = async () => {
        const url = `${urlPrefix}api/replays/verify/`;
        setLinkCount(false);

        const linkCountResponse = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        }).then(response => response.json());

        setLinkCount(linkCountResponse.count);
    };

    useEffect(() => {
        const fetchReplaySummary = async () => {
            const url = `${urlPrefix}api/replays/summary/`;

            const summary = await fetch(url, {
                method: 'GET',
                headers: { Authorization: `Token ${user.token}` },
            }).then(response => response.json());

            setReplaySummary(summary);
        };
        fetchReplaySummary();
    }, [linkCount]);

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
                    NOTE: Linking a new Battlenet Account will replace
                    your existing one. Replays will not be affected.
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
                {replaySummary &&
                    <div className="Settings__replay-summary">
                        <div className="Settings__replay-count-wrapper">
                            <div className="Settings__replay-count">
                                {replaySummary.linked + replaySummary.unlinked}
                            </div>
                            replays uploaded
                        </div>
                        <div className="Settings__replay-count-wrapper">
                            <div className="Settings__replay-count">
                                {replaySummary.linked}
                            </div>
                            replays linked to&nbsp;
                            <span style={{ textDecoration: 'underline', fontWeight: 400 }}>
                                {battlenetAccount.battletag}
                            </span>
                        </div>
                        <div className="Settings__replay-count-wrapper">
                            <div className="Settings__replay-count">
                                {replaySummary.unlinked}
                            </div>
                            replays unlinked
                        </div>
                    </div>}
                <div className="Settings__link-replays">
                    <button
                        className="Settings__settings-action"
                        disabled={linkCount}
                        onClick={linkReplays}
                    >
                        Link Replays
                    </button>
                    {linkCount === false && <SpinningRingAnimation />}
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
                {typeof linkCount === 'number' &&
                    <p className="Settings__link-count">
                        Trying to link {linkCount} replays.
                        Reload this page in a couple of minutes.
                    </p>}
            </div>
        </div>
    );
};

export default Settings;
