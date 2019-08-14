import { useState } from 'react';
import { Router, Redirect } from '@reach/router';
import LoginForm from './Components/LoginForm';
import Overview from './Components/Overview/Overview';
import Replays from './Components/Replays/Replays';
import Analysis from './Components/Analysis/Analysis';
import './ProfileApp.css';

const ProfileApp = () => {
    const [authorizationToken, setAuthorizationToken] = useState(null);

    if (!sessionStorage.token && authorizationToken) {
        sessionStorage.token = authorizationToken;
    }

    const updateToken = (newToken) => {
        setAuthorizationToken(newToken);
    };

    const currentToken = sessionStorage.token;

    let app;
    if (currentToken) {
        app = (
            <Router>
                <Redirect from="/login" to="/" />
                <Overview
                    pageTitle="Profile Overview"
                    handleToken={updateToken}
                    path="/"
                />
                <Replays
                    pageTitle="Replays"
                    handleToken={updateToken}
                    path="/replays"
                />
                <Analysis
                    pageTitle="Trend Analysis"
                    handleToken={updateToken}
                    path="/analysis"
                />
            </Router>
        );
    } else {
        app = (
            <Router>
                <Redirect from="/*" to="/login" />
                <LoginForm
                    authToken={currentToken}
                    handleToken={updateToken}
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
