import { Router } from '@reach/router';
import Overview from './Components/Overview/Overview';
import Replays from './Components/Replays/Replays';
import Analysis from './Components/Analysis/Analysis';
import './ProfileApp.css';

const ProfileApp = () => (
    <div className="ProfileApp">
        <Router>
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
    </div>
);

export default ProfileApp;
