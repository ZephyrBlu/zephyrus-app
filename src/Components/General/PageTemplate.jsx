import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Location, Router, Redirect } from '@reach/router';
import Tippy from '@tippy.js/react';
import { setDefaultUser, setReplays, setSelectedRace, setSelectedReplayHash } from '../../actions';
import Login from '../Login';
import Replays from '../Replays/Replays';
import Trends from '../Trends/Trends';
import Upload from '../Upload';
import Settings from '../Settings';
import PageSidebar from './PageSidebar';
import AccountSetup from '../AccountSetup';
import FeatureVote from './FeatureVote';
import './CSS/PageTemplate.css';

const PageTemplate = (props) => {
    const dispatch = useDispatch();
    const selectedRace = useSelector(state => state.selectedRace);
    const [showFeatureVote, setShowFeatureVote] = useState(false);
    const [visibleState, setVisibleState] = useState(true);

    // Set currentPage state as null for initial render
    const [currentPage, setCurrentPage] = useState(null);

    // When the defaultPage prop changes, reset the state of currentPage
    // to the new defaultPage prop.

    // Occurs when a user logs in or out
    useEffect(() => {
        setCurrentPage(props.defaultPage);
    }, [props.defaultPage]);

    const handleLogout = async () => {
        let urlPrefix;
        if (process.env.NODE_ENV === 'development') {
            urlPrefix = 'http://127.0.0.1:8000/';
        } else {
            urlPrefix = 'https://zephyrus.gg/';
        }

        const url = `${urlPrefix}api/logout/`;

        const error = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Token ${props.token}`,
            },
        }).then(response => (
            response.status === 200 ? null : `${response.status} ${response.statusText}`
        ));

        if (error) {
            alert('Something went wrong. Please try to logout again');
        }
        localStorage.clear();
        dispatch(setDefaultUser());
        dispatch(setReplays([]));
        dispatch(setSelectedReplayHash(null));
    };

    const pages = {
        Replays: 'Replays',
        Trends: 'Weekly Trends',
        Upload: 'Upload Replays',
    };

    const raceToggleStyle = {
        protoss: { marginLeft: '5px', opacity: '1' },
        zerg: { marginLeft: '61px', opacity: '1' },
        terran: { marginLeft: '117px', opacity: '1' },
        null: { opacity: '0' },
    };

    const capitalize = str => (
        str.charAt(0).toUpperCase() + str.slice(1)
    );

    const chooseRouter = (defaultPage) => {
        switch (defaultPage) {
            case 'Replays':
                return (
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
                        <Trends
                            path="/trends"
                        />
                        <Settings
                            path="/settings"
                        />
                    </Router>
                );

            case 'Setup':
                return (
                    <Router className="Router">
                        <Redirect from="/*" to="/setup" noThrow />
                        <AccountSetup
                            path="/setup"
                            setWaitingForUser={props.setWaitingForUser}
                        />
                    </Router>
                );

            default:
                return (
                    <Router className="Router">
                        <Redirect from="/*" to="/login" noThrow />
                        <Login
                            path="/login"
                            setWaitingForUser={props.setWaitingForUser}
                        />
                    </Router>
                );
        }
    };

    return (
        <div className="PageTemplate">
            <header className="PageTemplate__header">
                <h1 className="PageTemplate__title">
                    <a href="https://zephyrus.gg" className="PageTemplate__logo">z</a>&nbsp;
                    ZEPHYRUS <span className="PageTemplate__beta-icon">BETA</span>
                </h1>
                {currentPage && currentPage !== 'Login' &&
                    <Fragment>
                        <div className={`PageTemplate__page-info PageTemplate__page-info--${currentPage}`}>
                            <h1 className="PageTemplate__page-name">
                                {currentPage === 'Setup' ? 'Getting Started' : pages[currentPage]}
                            </h1>
                            {currentPage !== 'Setup' &&
                                <h2 className="PageTemplate__data-info">
                                    {selectedRace ? capitalize(selectedRace) : ''}
                                </h2>}
                        </div>
                        {currentPage !== 'Setup' &&
                            <Fragment>
                                <div className="PageTemplate__race-toggle">
                                    <div
                                        className="PageTemplate__toggle-indicator"
                                        style={raceToggleStyle[selectedRace]}
                                    />
                                    <button
                                        className="PageTemplate__toggle-button"
                                        onClick={() => {
                                            dispatch(setSelectedRace('protoss'));
                                            dispatch(setSelectedReplayHash(null));
                                        }}
                                    >
                                        <img
                                            src="../../icons/protoss-logo.svg"
                                            alt="Protoss"
                                            className="PageTemplate__race-icon"
                                        />
                                    </button>
                                    <button
                                        className="PageTemplate__toggle-button"
                                        onClick={() => {
                                            dispatch(setSelectedRace('zerg'));
                                            dispatch(setSelectedReplayHash(null));
                                        }}
                                    >
                                        <img
                                            src="../../icons/zerg-logo.svg"
                                            alt="Zerg"
                                            className="PageTemplate__race-icon"
                                        />
                                    </button>
                                    <button
                                        className="PageTemplate__toggle-button"
                                        onClick={() => {
                                            dispatch(setSelectedRace('terran'));
                                            dispatch(setSelectedReplayHash(null));
                                        }}
                                    >
                                        <img
                                            src="../../icons/terran-logo.svg"
                                            alt="Terran"
                                            className="PageTemplate__race-icon"
                                        />
                                    </button>
                                </div>
                                <Tippy
                                    className="PageTemplate__feature-vote-content"
                                    content={<FeatureVote />}
                                    placement="top-end"
                                    trigger="manual"
                                    maxWidth={360}
                                    visible={showFeatureVote}
                                    hideOnClick={false}
                                    interactive
                                >
                                    <div className="PageTemplate__feature-vote">
                                        <button
                                            className="PageTemplate__show-vote"
                                            onClick={() => (
                                                showFeatureVote ?
                                                    setShowFeatureVote(false) : setShowFeatureVote(true)
                                            )}
                                        >
                                            Vote on New Features&nbsp;
                                            <img
                                                className="PageTemplate__feature-vote-arrow"
                                                src="../../icons/arrow-right-black.svg"
                                                alt="show-feature-vote"
                                            />
                                        </button>
                                    </div>
                                </Tippy>
                            </Fragment>}
                        {currentPage === 'Replays' &&
                            <span className="PageTemplate__hide-wrapper">
                                {visibleState ? 'Hide Replays' : ''}
                                <button
                                    className="PageTemplate__hide-side-bar"
                                    onClick={() => (visibleState ? setVisibleState(false) : setVisibleState(true))}
                                >
                                    <img
                                        className="PageTemplate__hide-icon"
                                        src="../../icons/arrow-right.svg"
                                        alt="hide-button"
                                        style={visibleState ? {} : { transform: 'rotate(180deg)' }}
                                    />
                                </button>
                            </span>}
                    </Fragment>}
                {currentPage === 'Setup' &&
                    <button className="PageTemplate__logout" onClick={handleLogout}>
                        Logout
                    </button>}
            </header>
            {currentPage && currentPage !== 'Login' && currentPage !== 'Setup' &&
                <PageSidebar pages={Object.keys(pages)} />}
            <section
                className={`PageTemplate__page-content PageTemplate__page-content--${currentPage}`}
            >
                {currentPage &&
                    <Location>
                        {({ location }) => {
                            let currentComponent = location.pathname.slice(1);
                            currentComponent = currentComponent.charAt(0).toUpperCase() + currentComponent.slice(1);
                            if (currentComponent) {
                                setCurrentPage(currentComponent);
                            }

                            return chooseRouter(props.defaultPage);
                        }}
                    </Location>}
            </section>
        </div>
    );
};

export default PageTemplate;
