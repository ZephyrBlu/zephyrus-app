import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useRouter } from './hooks';
import { handleFetch, updateUserAccount } from './utils';
import { URL_PREFIX, PAGES } from './constants';
import Zephyrus from './components/Page/Zephyrus';
import Header from './components/Page/Header';
import './components/Page/CSS/Page.css';
import './App.css';

const App = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const router = useRouter(user);
    useAccount(user ? user.token : null);

    // one time check for OAuth authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    // can't use useEffect as it fires after rendering has been completed
    // this means the router will have already redirected from the url with params containing the auth code
    // useMemo makes this only fire once on startup
    useMemo(() => {
        const setBattlenetAccount = async () => {
            const url = `${URL_PREFIX}api/authorize/code/`;
            const opts = {
                method: 'POST',
                headers: { Authorization: `Token ${user.token}` },
                body: JSON.stringify({ authCode }),
            };
            const res = await handleFetch(url, opts);

            if (res.ok) {
                updateUserAccount(user.token, URL_PREFIX, dispatch);
            }
        };

        if (user && user.token && authCode) {
            setBattlenetAccount();
        }
    }, []);

    // useCallback used to preserve referential equality between renders
    // this prevents <Zephyrus /> from re-rendering during background re-fetching
    const renderHeader = useCallback(renderProps => <Header {...renderProps} />, []); // eslint-disable-line react/jsx-props-no-spreading
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
