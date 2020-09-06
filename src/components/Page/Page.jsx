import { useSelector, useDispatch } from 'react-redux';
import React, { useState, Fragment, useContext, useEffect } from 'react';
import Tippy from '@tippy.js/react';
import UrlContext from '../../index';
import { handleFetch } from '../../utils';
import { logoutReset } from '../../actions';
import { useRouter } from '../../hooks';
import Title from './Title';
import RaceToggle from './RaceToggle';
import PageSidebar from './PageSidebar';
import FeedbackForm from './FeedbackForm';
import './CSS/Page.css';

const Page = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const selectedRace = useSelector(state => state.selectedRace);
    const [currentPage, setCurrentPage] = useState(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [currentHelpQuote, setCurrentHelpQuote] = useState(null);
    const [visibleState, setVisibleState] = useState(true);
    const router = useRouter(visibleState);
    const urlPrefix = useContext(UrlContext);

    const pages = {
        Replays: 'Replays',
        Winrate: 'Winrate',
        Performance: 'Season Stats',
        Trends: 'Trends',
        Upload: 'Upload Replays',
    };

    const helpQuotes = {
        'Yes, Executor?': 'Adept',
        'What would you ask of us?': 'Dark Templar',
        'Speak and be heard': 'Disruptor',
        'I hear the call': 'Immortal',
        'You require my skills?': 'Stalker',
        'It shall be done': 'Void Ray',
        'You seek guidance?': 'Oracle',
        'Who called in the fleet?': 'Battlecruiser',
        'I hear you': 'Hellbat',
        'Talk to me, boss!': 'Hellion',
        'You gonna give me orders?': 'Marine',
        'Where\'s the emergency?': 'Medivac',
        'State your request': 'Raven',
        'I\'m listenin\'': 'Reaper',
    };

    const capitalize = str => (
        str.charAt(0).toUpperCase() + str.slice(1)
    );

    const handleLogout = () => {
        const url = `${urlPrefix}api/logout/`;
        const opts = {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        };

        handleFetch(url, opts);
        localStorage.clear();
        dispatch(logoutReset());
    };

    useEffect(() => {
        if (!showFeedbackForm) {
            const debounce = showFeedbackForm ? 0 : 200;
            setTimeout(() => {
                const quoteKeys = Object.keys(helpQuotes);
                const selectedQuote = quoteKeys[Math.floor(Math.random() * quoteKeys.length)];
                const selectedQuoteUnit = helpQuotes[selectedQuote];
                setCurrentHelpQuote({ quote: selectedQuote, unit: selectedQuoteUnit });
            }, debounce);
        }
    }, [showFeedbackForm]);

    return (
        <div className="Page">
            <header className="Page__header">
                <Title />
                {currentPage && currentPage !== 'Login' && currentPage !== 'Settings' &&
                    <Fragment>
                        <div className={`Page__page-info Page__page-info--${currentPage}`}>
                            <h1 className="Page__page-name">
                                {currentPage === 'Setup' ? 'Getting Started' : pages[currentPage]}
                            </h1>
                            {currentPage !== 'Setup' &&
                                <h2 className="Page__data-info">
                                    {selectedRace ? capitalize(selectedRace) : ''}
                                </h2>}
                        </div>
                        {currentPage !== 'Setup' &&
                            <Fragment>
                                <RaceToggle />
                                <Tippy
                                    className="Page__feature-vote-content"
                                    content={
                                        <FeedbackForm
                                            titleQuote={currentHelpQuote}
                                            setShowFeedbackForm={setShowFeedbackForm}
                                        />
                                    }
                                    placement="top-end"
                                    trigger="manual"
                                    maxWidth={400}
                                    visible={showFeedbackForm}
                                    hideOnClick={false}
                                    interactive
                                >
                                    <div className="Page__feedback">
                                        <button
                                            className="Page__show-vote"
                                            onClick={() => (
                                                showFeedbackForm ?
                                                    setShowFeedbackForm(false) : setShowFeedbackForm(true)
                                            )}
                                        >
                                            Talk to a Human&nbsp;
                                            <img
                                                className="Page__feature-vote-arrow"
                                                src="../../icons/arrow-right-black.svg"
                                                alt="show-feature-vote"
                                            />
                                        </button>
                                    </div>
                                </Tippy>
                            </Fragment>}
                        {currentPage === 'Replays' &&
                            <span className="Page__hide-wrapper">
                                {visibleState ? 'Hide Replays' : ''}
                                <button
                                    className="Page__hide-side-bar"
                                    onClick={() => (visibleState ? setVisibleState(false) : setVisibleState(true))}
                                >
                                    <img
                                        className="Page__hide-icon"
                                        src="../../icons/arrow-right.svg"
                                        alt="hide-button"
                                        style={visibleState ? {} : { transform: 'rotate(180deg)' }}
                                    />
                                </button>
                            </span>}
                    </Fragment>}
                {currentPage === 'Setup' &&
                    <button className="Page__logout" onClick={handleLogout}>
                        Logout
                    </button>}
            </header>
            {currentPage !== 'Login' && currentPage !== 'Setup' &&
                <PageSidebar pages={Object.keys(pages)} />}
            <section className={`Page__page-content Page__page-content--${currentPage}`}>
                {router(setCurrentPage)}
            </section>
        </div>
    );
};

export default Page;
