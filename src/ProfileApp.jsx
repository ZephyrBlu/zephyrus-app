import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Router, Redirect } from '@reach/router';
import { setAuthToken, setApiKey } from './actions';
import Login from './Components/Login';
import Overview from './Components/Overview/Overview';
import Replays from './Components/Replays/Replays';
import Analysis from './Components/Analysis/Analysis';
import Upload from './Components/Upload/Upload';
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

    let app;
    if (token) {
        app = (
            <Router className="ProfileApp__router">
                <Redirect from="/login" to="/replays" />
                <Redirect from="/" to="/replays" />
                <Overview
                    pageTitle="Profile Overview"
                    path="/overview"
                />
                <Upload
                    pageTitle="Upload Replays"
                    path="/upload"
                />
                <Replays
                    pageTitle="Replays"
                    path="/replays"
                />
                <Analysis
                    pageTitle="Trend Analysis"
                    path="/analysis"
                />
            </Router>
        );
    } else {
        app = (
            <Router>
                <Redirect from="/*" to="/login" />
                <Login
                    path="/login"
                />
            </Router>
        );
    }

    return (
        <div className="ProfileApp">
            {app}
        </div>
    );
};

export default ProfileApp;
