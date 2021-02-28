import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { URL_PREFIX } from '../../constants';
import { handleFetch } from '../../utils';
import { logoutReset } from '../../actions';
import Title from './Title';
import PageSidebar from './PageSidebar';
import './CSS/Page.css';

const Page = ({ pages, header, content }) => {
    const dispatch = useDispatch();
    const [user, visibleState] = useSelector(state => [state.user, state.visibleState], shallowEqual);
    const [currentPage, setCurrentPage] = useState(null);

    // creates a closure of current user state
    // useCallback to memoize the function and create stable reference
    const handleLogout = useCallback(() => {
        if (!user) {
            return;
        }

        const url = `${URL_PREFIX}api/logout/`;
        const opts = {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        };

        handleFetch(url, opts);
        localStorage.clear();
        dispatch(logoutReset());
    }, [user]);

    const pageProps = {
        currentPage,
        setCurrentPage,
        visibleState,
    };

    return (
        <div className="Page">
            <header className="Page__header">
                <Title />
                {header(pageProps)}
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
                {content(pageProps)}
            </section>
        </div>
    );
};

export default Page;
