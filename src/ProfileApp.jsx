import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setUser, setSelectedRace } from './actions';
import useReplayPolling from './useReplayPolling';
import PageTemplate from './Components/General/PageTemplate';
import './ProfileApp.css';

const ProfileApp = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [defaultPage, setDefaultPage] = useState(null);
    const [waitingForUser, setWaitingForUser] = useState(true);

    useReplayPolling(30000);

    useEffect(() => {
        if (localStorage.user) {
            const localUser = JSON.parse(localStorage.user);

            if (localUser.verified && localUser.battlenet_accounts && Object.keys(localUser.battlenet_accounts[0].profiles).length > 0) {
                setWaitingForUser(false);
            }

            if (localStorage.user && !user.email) {
                dispatch(setUser(localUser));
                dispatch(setSelectedRace(localUser.main_race));
            }
        }
    }, []);

    let urlPrefix;
    if (process.env.NODE_ENV === 'development') {
        urlPrefix = 'http://127.0.0.1:8000/';
    } else {
        urlPrefix = 'https://zephyrus.gg/';
    }

    // one time check for OAuth authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    useEffect(() => {
        const checkAccountStatus = async () => {
            const url = `${urlPrefix}api/authorize/check/`;

            const updatedUser = await fetch(url, {
                method: 'GET',
                headers: { Authorization: `Token ${user.token}` },
            }).then(response => (
                response.json()
            )).catch(() => null);

            dispatch(setUser(updatedUser.user));
            localStorage.user = JSON.stringify(updatedUser.user);
        };

        if (authCode) {
            localStorage.authCode = authCode;
        }

        if (user.token) {
            checkAccountStatus();
        }
    }, [user.token]);

    useEffect(() => {
        if (user.token) {
            if (!waitingForUser && user.verified && user.battlenetAccounts && Object.keys(user.battlenetAccounts[0].profiles).length > 0) {
                setDefaultPage('Replays');
            } else {
                setDefaultPage('Setup');
            }
        } else {
            setDefaultPage('Login');
        }
    }, [user, waitingForUser]);

    return (
        <div className="ProfileApp">
            <PageTemplate
                token={user.token}
                defaultPage={defaultPage}
                setWaitingForUser={setWaitingForUser}
            />
        </div>
    );
};

export default ProfileApp;
