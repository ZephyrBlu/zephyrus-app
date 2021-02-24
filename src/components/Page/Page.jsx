import { useSelector, useDispatch } from 'react-redux';
import React, { useState, Fragment, useContext } from 'react';
import UrlContext from '../../index';
import { PAGES } from'../../constants';
import { handleFetch, capitalize } from '../../utils';
import { logoutReset } from '../../actions';
import { useRouter } from '../../hooks';
import Title from './Title';
import RaceToggle from './RaceToggle';
import PageSidebar from './PageSidebar';
import FeedbackModal from './FeedbackModal';
import './CSS/Page.css';

const Page = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const visibleState = useSelector(state => state.visibleState);
    const selectedRace = useSelector(state => state.selectedRace);
    const [currentPage, setCurrentPage] = useState(null);
    const router = useRouter();
    const urlPrefix = useContext(UrlContext);

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

    return (
        <div className="Page">
            <header className="Page__header">
                <Title />
                {currentPage && currentPage !== 'Login' && currentPage !== 'Settings' &&
                    <Fragment>
                        <div className={`Page__page-info Page__page-info--${currentPage}`}>
                            <h1 className="Page__page-name">
                                {currentPage === 'Setup' ? 'Getting Started' : PAGES[currentPage]}
                            </h1>
                            {currentPage !== 'Setup' &&
                                <h2 className="Page__data-info">
                                    {selectedRace ? capitalize(selectedRace) : ''}
                                </h2>}
                        </div>
                        {currentPage !== 'Setup' &&
                            <Fragment>
                                <RaceToggle />
                                <FeedbackModal />
                            </Fragment>}
                        {currentPage === 'Replays' &&
                            <span className="Page__hide-wrapper">
                                {visibleState ? 'Hide Replays' : ''}
                                <button
                                    className="Page__hide-side-bar"
                                    onClick={() => (
                                        visibleState
                                            ? dispatch(setVisibleState(false))
                                            : dispatch(setVisibleState(true))
                                    )}
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
                <PageSidebar />}
            <section className={`Page__page-content Page__page-content--${currentPage}`}>
                {router(setCurrentPage)}
            </section>
        </div>
    );
};

export default Page;
