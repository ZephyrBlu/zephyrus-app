import React, { memo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { URL_PREFIX } from '../../constants';
import { handleFetch } from '../../utils';
import { logoutReset } from '../../actions';
import Title from './Title';
import PageSidebar from './PageSidebar';
import ErrorBoundary from '../shared/ErrorBoundary';
import './CSS/Page.css';

const Zephyrus = ({ pages, header, content }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => (state.user ? state.user.token : null));
    const [currentPage, setCurrentPage] = useState(null);
    const [isReplayListVisible, setIsReplayListVisible] = useState(true);

    // creates a closure of current user state
    // useCallback to memoize the function and create stable reference
    const handleLogout = useCallback(() => {
        if (!token) {
            return;
        }

        const url = `${URL_PREFIX}api/logout/`;
        const opts = {
            method: 'GET',
            headers: { Authorization: `Token ${token}` },
        };

        handleFetch(url, opts);
        localStorage.clear();
        dispatch(logoutReset());
    }, [token]);

    const pageProps = {
        currentPage,
        setCurrentPage,
        isReplayListVisible,
        setIsReplayListVisible,
    };

    return (
        <div className="Page">
            <header className="Page__header">
                <Title />
                {header && header(pageProps)}
                {currentPage === 'Setup' &&
                    <button
                        className="Page__logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>}
            </header>
            {currentPage !== 'Login' && currentPage !== 'Setup' &&
                <PageSidebar
                    pages={pages}
                    handleLogout={handleLogout}
                />}
            <section className={`Page__page-content Page__page-content--${currentPage}`}>
                <ErrorBoundary>
                    {content && content(pageProps)}
                </ErrorBoundary>
            </section>
        </div>
    );
};

export default memo(Zephyrus);
