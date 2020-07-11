import { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useLoadingState from '../useLoadingState';
import UrlContext from '../index';
import { handleFetch, loadingStates } from '../utils';
import InfoTooltip from './shared/InfoTooltip';
import LoadingAnimation from './shared/LoadingAnimation';
import SpinningRingAnimation from './shared/SpinningRingAnimation';
import './Settings.css';

const Settings = () => {
    const urlPrefix = useContext(UrlContext);
    const user = useSelector(state => state.user);
    const battlenetAccount = user.battlenetAccounts[0];
    const [replaySummary, setReplaySummary] = useState({
        data: null,
        loadingState: loadingStates.INITIAL,
    });
    const [linkCount, setLinkCount] = useState({
        data: null,
        loadingState: loadingStates.INITIAL,
    });

    const opts = {
        method: 'GET',
        headers: { Authorization: `Token ${user.token}` },
    };

    const dataStates = {
        replaySummary: {
            [loadingStates.INITIAL]: null,
            [loadingStates.IN_PROGRESS]: (<LoadingAnimation />),
            [loadingStates.SUCCESS]: ({ linked, unlinked }) => (
                <div className="Settings__replay-summary">
                    <div className="Settings__replay-count-wrapper">
                        <div className="Settings__replay-count">
                            {linked + unlinked}
                        </div>
                        replays uploaded
                    </div>
                    <div className="Settings__replay-count-wrapper">
                        <div className="Settings__replay-count">
                            {linked}
                        </div>
                        replays linked to&nbsp;
                        <span style={{ textDecoration: 'underline', fontWeight: 400 }}>
                            {battlenetAccount.battletag}
                        </span>
                    </div>
                    <div className="Settings__replay-count-wrapper">
                        <div className="Settings__replay-count">
                            {unlinked}
                        </div>
                        replays unlinked
                    </div>
                </div>
            ),
            [loadingStates.ERROR]: (
                <p className="Settings__replay-summary">
                    Something went wrong.
                </p>
            ),
        },
        linkCount: {
            [loadingStates.INITIAL]: null,
            [loadingStates.IN_PROGRESS]: (<SpinningRingAnimation />),
            [loadingStates.SUCCESS]: data => (
                <p className="Settings__link-count">
                    Trying to link {data} replays.
                    Reload this page in a couple of minutes.
                </p>
            ),
            [loadingStates.ERROR]: (
                <p className="Settings__link-count">
                    Something went wrong.
                </p>
            ),
        },
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
        setLinkCount(prevState => ({
            ...prevState,
            loadingState: loadingStates.IN_PROGRESS,
        }));
        const linkCountResponse = await handleFetch(url, opts);

        if (linkCountResponse.ok) {
            setLinkCount({
                data: linkCountResponse.data.count,
                loadingState: loadingStates.SUCCESS,
            });
        } else {
            setLinkCount({
                data: false,
                loadingState: loadingStates.ERROR,
            });
        }
    };

    useEffect(() => {
        const fetchReplaySummary = async () => {
            const url = `${urlPrefix}api/replays/summary/`;
            setReplaySummary(prevState => ({
                ...prevState,
                loadingState: loadingStates.IN_PROGRESS,
            }));
            const summary = await handleFetch(url, opts);

            if (summary.ok) {
                setReplaySummary({
                    data: summary.data,
                    loadingState: loadingStates.SUCCESS,
                });
            } else {
                setReplaySummary({
                    data: false,
                    loadingState: loadingStates.ERROR,
                });
            }
        };
        fetchReplaySummary();
    }, []);

    const ReplaySummaryState = useLoadingState(replaySummary, dataStates.replaySummary);
    const LinkCountState = useLoadingState(linkCount, dataStates.linkCount);

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
                <ReplaySummaryState />
                <div className="Settings__link-replays">
                    <button
                        className="Settings__settings-action"
                        disabled={linkCount.data}
                        onClick={linkReplays}
                    >
                        Link Replays
                    </button>
                    <LinkCountState specifiedState={loadingStates.IN_PROGRESS} />
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
                <LinkCountState />
            </div>
        </div>
    );
};

export default Settings;
