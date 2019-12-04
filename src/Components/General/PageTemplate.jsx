import { useEffect, useState, Fragment } from 'react';
import { Location, Router, Redirect } from '@reach/router';
import Login from '../Login';
import Overview from '../Overview/Overview';
import Replays from '../Replays/Replays';
import Analysis from '../Analysis/Analysis';
import Upload from '../Upload';
import Settings from '../Settings';
import PageSidebar from './PageSidebar';
import './CSS/PageTemplate.css';

const PageTemplate = (props) => {
    const [visibleState, setVisibleState] = useState(true);
    const [selectedRace, setSelectedRace] = useState('Protoss');

    // Set currentPage state as null for initial render
    const [currentPage, setCurrentPage] = useState(null);

    // When the defaultPage prop changes, reset the state of currentPage
    // to the new defaultPage prop.
    //
    // Occurs when a user logs in or out
    useEffect(() => {
        setCurrentPage(props.defaultPage);
    }, [props.defaultPage]);

    const pages = {
        Overview: 'Profile Overview',
        Replays: 'Replays',
        Analysis: 'Trend Analysis',
        Upload: 'Upload Replays',
    };

    const raceToggleStyle = {
        Protoss: { marginLeft: '5px' },
        Zerg: { marginLeft: '61px' },
        Terran: { marginLeft: '117px' },
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
                                {pages[currentPage]}
                            </h1>
                            <h2 className="PageTemplate__data-info">
                                {selectedRace}
                            </h2>
                        </div>
                        <div className="PageTemplate__race-toggle">
                            <div
                                className="PageTemplate__toggle-indicator"
                                style={raceToggleStyle[selectedRace]}
                            />
                            <button
                                className="PageTemplate__toggle-button"
                                onClick={() => {
                                    setSelectedRace('Protoss');
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
                                    setSelectedRace('Zerg');
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
                                    setSelectedRace('Terran');
                                }}
                            >
                                <img
                                    src="../../icons/terran-logo.svg"
                                    alt="Terran"
                                    className="PageTemplate__race-icon"
                                />
                            </button>
                        </div>
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
            </header>
            {currentPage && currentPage !== 'Login' &&
                <PageSidebar pages={Object.keys(pages)} />}
            <section
                className={`PageTemplate__page-content PageTemplate__page-content--${currentPage}`}
            >
                {currentPage && currentPage !== 'Login' &&
                    <Location>
                        {({ location }) => {
                            let currentComponent = location.pathname.slice(1);
                            currentComponent = currentComponent.charAt(0).toUpperCase() + currentComponent.slice(1);
                            if (currentComponent !== 'Login') {
                                setCurrentPage(currentComponent);
                            }

                            return (
                                <Router className="Router">
                                    <Redirect from="/login" to="/replays" noThrow />
                                    <Redirect from="/" to="/replays" noThrow />
                                    <Overview
                                        path="/overview"
                                    />
                                    <Upload
                                        path="/upload"
                                    />
                                    <Replays
                                        path="/replays"
                                        visibleState={visibleState}
                                    />
                                    <Analysis
                                        path="/analysis"
                                    />
                                    <Settings
                                        path="/settings"
                                    />
                                </Router>
                            );
                        }}
                    </Location>}
                {currentPage && currentPage === 'Login' &&
                    <Router className="Router">
                        <Redirect from="/*" to="/login" noThrow />
                        <Login
                            path="/login"
                        />
                    </Router>}
            </section>
        </div>
    );
};

export default PageTemplate;
