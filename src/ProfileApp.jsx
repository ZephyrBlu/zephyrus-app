import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setUser } from './actions';
import PageTemplate from './Components/General/PageTemplate';
import './ProfileApp.css';

const ProfileApp = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [checkingUserAccount, setCheckingUserAccount] = useState(false);

    if (sessionStorage.user && !user.email) {
        dispatch(setUser(JSON.parse(sessionStorage.user)));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    useEffect(() => {
        if (authCode) {
            sessionStorage.authCode = authCode;
        }
    }, []);

    useEffect(() => {
        const checkAccountStatus = async () => {
            setCheckingUserAccount(true);

            let urlPrefix;
            if (process.env.NODE_ENV === 'development') {
                urlPrefix = 'http://127.0.0.1:8000/';
            } else {
                urlPrefix = 'https://zephyrus.gg/';
            }
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
            setCheckingUserAccount(false);
        };

        if (user.token && (!user.battlenetAccounts || !user.verified)) {
            checkAccountStatus();
        }
    }, [user.token]);

    const chooseDefaultPage = () => {
        if (user.token && !checkingUserAccount) {
            if (user.verified && user.battlenetAccounts && Object.keys(user.battlenetAccounts[0].profiles).length > 0) {
                return 'Replays';
            }
            return 'Setup';
        }
        return 'Login';
    };

    return (
        <div className="ProfileApp">
            <PageTemplate defaultPage={chooseDefaultPage()} />
        </div>
    );
};

export default ProfileApp;
