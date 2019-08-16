import { useSelector } from 'react-redux';
import { Router, Redirect } from '@reach/router';
import LoginForm from './Components/LoginForm';
import Overview from './Components/Overview/Overview';
import Replays from './Components/Replays/Replays';
import Analysis from './Components/Analysis/Analysis';
import './ProfileApp.css';

const ProfileApp = () => {
    let token;
    useSelector((state) => { token = state.token; });

    let app;
    if (token) {
        app = (
            <Router>
                <Redirect from="/login" to="/" />
                <Overview
                    pageTitle="Profile Overview"
                    path="/"
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
                <LoginForm
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
