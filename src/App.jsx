import React, { useEffect, useCallback } from 'react';
import { useAccount, useRouter } from './hooks';
import { PAGES } from './constants';
import Zephyrus from './components/Page/Zephyrus';
import Header from './components/Page/Header';
import './components/Page/CSS/Page.css';
import './App.css';

const App = () => {
    const router = useRouter();
    useAccount();

    // one time check for OAuth authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    useEffect(() => {
        if (authCode) {
            localStorage.authCode = authCode;
        }
    }, []);

    // useCallback used to preserve referential equality between renders
    // this prevents <Zephyrus /> from re-rendering during background re-fetching
    const renderHeader = useCallback(renderProps => <Header {...renderProps} />, []);
    const renderContent = useCallback(({ isReplayListVisible, setCurrentPage }) => (
        router(setCurrentPage, isReplayListVisible)
    ), []);

    return (
        <div className="App">
            <Zephyrus
                pages={PAGES}
                header={renderHeader}
                content={renderContent}
            />
        </div>
    );
};

export default App;
