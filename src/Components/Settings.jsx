import { useContext } from 'react';
import { useSelector } from 'react-redux';
import InfoTooltip from './shared/InfoTooltip';
import UrlContext from '../index';
import './Settings.css';

const Settings = () => {
    const urlPrefix = useContext(UrlContext);
    const user = useSelector(state => state.user);
    const battlenetAccount = user.battlenetAccounts[0];

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

    return (
        <div className="Settings">
            <div className="Settings__header">
                <div className="Settings__battlenet-account">
                    <h1 className="Settings__battletag">
                        {battlenetAccount.battletag}
                    </h1>
                    <button
                        className="Settings__link-battlenet-account"
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
                <h1 className="Settings__profiles-title">
                    Battlenet Profiles
                </h1>
                {Object.values(battlenetAccount.profiles).map(profile => (
                    <div key={profile.region_name} className="Settings__battlenet-region">
                        <div className="Settings__battlenet-region-info">
                            <h2 className="Settings__region-name">
                                {profile.region_name}
                            </h2>
                            <h3 className="Settings__profile-name">
                                {profile.profile_name}
                            </h3>
                        </div>
                        {profile.profile_id.map(p_id => (
                            <p key={`profile-id-${p_id}`} className="Settings__battlenet-profile-id">
                                {p_id}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
