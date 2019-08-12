import { Router } from '@reach/router';
// import { useState } from 'react';
import Overview from './Tabs/Overview';
import Replays from './Tabs/Replays';
import Analysis from './Tabs/Analysis';
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
