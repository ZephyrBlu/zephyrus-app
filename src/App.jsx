import React, { useEffect } from 'react';
import { useAccount, useReplays, usePerformance, useTrends } from './hooks';
import Page from './components/Page/Page';
import './components/Page/CSS/Page.css';
import './App.css';

const App = () => {
    useAccount();
    useReplays(30000);
    usePerformance();
    useTrends();

    // one time check for OAuth authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    useEffect(() => {
        if (authCode) {
            localStorage.authCode = authCode;
        }
    }, []);

    return (
        <div className="App">
            <Page />
        </div>
    );
};

export default App;
