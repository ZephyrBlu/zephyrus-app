import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Location, Router, Redirect } from '@reach/router';
import Login from '../components/Login';
import Replays from '../components/Replays/Replays';
import Winrate from '../components/Winrate';
import Performance from '../components/Performance/Performance';
import Trends from '../components/Trends/Trends';
import Upload from '../components/Upload';
import Settings from '../components/Settings';
import AccountSetup from '../components/AccountSetup';

const useRouter = (user) => {
    const userState = user /* eslint-disable-line no-nested-ternary */
        ? (user.verified
        && !!user.battlenetAccounts
        && Object.keys(user.battlenetAccounts[0].profiles).length > 0)
        : null;

    // must track waitingForUser since we allow users to choose to continue
    // rather than automatically rendering a new screen once they have linked an account
    const [waitingForUser, setWaitingForUser] = useState(!userState);

    /*
        can't use useEffect because it executes after the render. This is an issue because after the render,
        the user's data has been flushed but the router has not been changed. This causes errors because components
        expect the user data to exist.

        Solution is to execute router choice logic on every render. This means the code is executed quite often,
        but since it's only a few simple comparison it should not be a big deal.
    */
    let _router = null;
    if (!waitingForUser && userState) {
        // assigning this as a function is a hack to play nicely with the rules of hooks
        _router = isReplayListVisible => (
            <Router className="Router">
                <Redirect from="/login" to="/replays" noThrow />
                <Redirect from="/setup" to="/replays" noThrow />
                <Redirect from="/" to="/replays" noThrow />
                <Upload
                    path="/upload"
                />
                <Replays
                    path="/replays"
                    isReplayListVisible={isReplayListVisible}
                />
                <Winrate
                    path="/winrate"
                />
                <Performance
                    path="/performance"
                />
                <Trends
                    path="/trends"
                />
                <Settings
                    path="/settings"
                />
            </Router>
        );
    } else if (userState === false || (waitingForUser && userState)) {
        _router = (
            <Router className="Router">
                <Redirect from="/*" to="/setup" noThrow />
                <AccountSetup path="/setup" setWaitingForUser={setWaitingForUser} />
            </Router>
        );
    } else {
        _router = (
            <Router className="Router">
                <Redirect from="/*" to="/login" noThrow />
                <Login path="/login" setWaitingForUser={setWaitingForUser} />
            </Router>
        );
    }

    /*
        must provide setCurrentPage function as an argument to returned function
        since it creates a closure. Due to the closure there is no way for the function
        to access the setCurrentPage function globally.
    */
    const router = (setCurrentPage, isReplayListVisible) => (
        <Location>
            {({ location }) => {
                let currentComponent = location.pathname.slice(1);
                currentComponent = currentComponent.charAt(0).toUpperCase() + currentComponent.slice(1);
                if (currentComponent) {
                    setCurrentPage(currentComponent);
                }

                // hack to make it play nicely with rules of hooks
                return typeof _router === 'function'
                    ? _router(isReplayListVisible)
                    : _router;
            }}
        </Location>
    );
    return router;
};

export default useRouter;
