import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Location, Router, Redirect } from '@reach/router';
import Login from '../components/Login';
import Replays from '../components/Replays/Replays';
import Performance from '../components/Performance/Performance';
import Trends from '../components/Trends';
import Upload from '../components/Upload';
import Settings from '../components/Settings';
import AccountSetup from '../components/AccountSetup';

const useRouter = (visibleState) => {
    const user = useSelector(state => state.user);
    const userState = user /* eslint-disable-line no-nested-ternary */
        ? (user.verified
        && !!user.battlenetAccounts
        && Object.keys(user.battlenetAccounts[0].profiles).length > 0)
        : null;
    const [waitingForUser, setWaitingForUser] = useState(!userState);
    let _router;

    if (!waitingForUser && userState) {
        _router = (
            <Router className="Router">
                <Redirect from="/login" to="/replays" noThrow />
                <Redirect from="/setup" to="/replays" noThrow />
                <Redirect from="/" to="/replays" noThrow />
                <Upload
                    path="/upload"
                />
                <Replays
                    path="/replays"
                    visibleState={visibleState}
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

    const router = setCurrentPage => (
        <Location>
            {({ location }) => {
                let currentComponent = location.pathname.slice(1);
                currentComponent = currentComponent.charAt(0).toUpperCase() + currentComponent.slice(1);
                if (currentComponent) {
                    setCurrentPage(currentComponent);
                }

                return _router;
            }}
        </Location>
    );

    return router;
};

export default useRouter;
