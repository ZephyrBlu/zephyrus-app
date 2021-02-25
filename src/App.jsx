import React, { useEffect } from 'react';
import { useAccount, useReplays, usePerformance, useTrends, useWinrate, useRouter } from './hooks';
import { PAGES } from './constants';
import Page from './components/Page/Page';
import Header from './components/Page/Header';
import './components/Page/CSS/Page.css';
import './App.css';

const App = () => {
    useAccount();
    useReplays(30000);
    usePerformance();
    useTrends();
    useWinrate();
    const router = useRouter();

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
            <Page
                pages={PAGES}
                header={renderProps => <Header {...renderProps} />}
                content={renderProps => router(renderProps.setCurrentPage)}
            />
        </div>
    );
};

export default App;
