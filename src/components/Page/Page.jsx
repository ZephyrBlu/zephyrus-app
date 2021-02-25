import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useContext } from 'react';
import UrlContext from '../../index';
import { handleFetch } from '../../utils';
import { logoutReset } from '../../actions';
import Title from './Title';
import PageSidebar from './PageSidebar';
import './CSS/Page.css';

const Page = ({ pages, header, content }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const visibleState = useSelector(state => state.visibleState);
    const [currentPage, setCurrentPage] = useState(null);

    const urlPrefix = useContext(UrlContext);

    // can't extract into utils because of useDispatch hook
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
                    <button className="Page__logout" onClick={handleLogout}>
                        Logout
                    </button>}
            </header>
            {currentPage !== 'Login' && currentPage !== 'Setup' &&
                <PageSidebar pages={pages} />}
            <section className={`Page__page-content Page__page-content--${currentPage}`}>
                {content(pageProps)}
            </section>
        </div>
    );
};

export default Page;
