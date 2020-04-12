import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import useReplays from './useReplays';
import useTrends from './useTrends';
import Page from './components/Page/Page';
import './components/Page/CSS/Page.css';
import './App.css';

const App = () => {
    const user = useSelector(state => state.user);
    useReplays(30000);
    useTrends();

    // one time check for OAuth authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    useEffect(() => {
        if (authCode) {
            localStorage.authCode = authCode;
        }
    }, [user]);

    return (
        <div className="App">
            <Page />
        </div>
    );
};

export default App;
