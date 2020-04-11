import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import useReplayPolling from './useReplayPolling';
import Page from './components/Page/Page';
import './components/Page/CSS/Page.css';
import './App.css';

const App = () => {
    const user = useSelector(state => state.user);
    useReplayPolling(30000);

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
