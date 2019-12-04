import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setAuthToken, setApiKey } from './actions';
import PageTemplate from './Components/General/PageTemplate';
import './ProfileApp.css';

const ProfileApp = () => {
    const dispatch = useDispatch();
    let token = useSelector(state => state.token);
    let apiKey = useSelector(state => state.apiKey);
    if (sessionStorage.token && !token) {
        token = sessionStorage.token;
        dispatch(setAuthToken(token));
    }

    if (sessionStorage.apiKey && !apiKey) {
        apiKey = sessionStorage.apiKey;
        dispatch(setApiKey(apiKey));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    useEffect(() => {
        const setBattlenetAccount = async () => {
            let urlPrefix;
            if (process.env.NODE_ENV === 'development') {
                urlPrefix = 'http://127.0.0.1:8000/';
            } else {
                urlPrefix = 'https://zephyrus.gg/';
            }

            const url = `${urlPrefix}api/authorize/code/`;

            await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ authCode }),
            }).then(response => (
                response.status
            )).catch(() => null);

            window.location.replace('https://app.zephyrus.gg/replays');
        };

        if (authCode) {
            setBattlenetAccount();
        }
    }, []);

    const app = <PageTemplate defaultPage={token ? 'Replays' : 'Login'} />;

    return (
        <div className="ProfileApp">
            {app}
        </div>
    );
};

export default ProfileApp;
