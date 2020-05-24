import { useSelector, useDispatch } from 'react-redux';
import { useState, Fragment, useContext } from 'react';
// import Tippy from '@tippy.js/react';
import UrlContext from '../../index';
import { logoutReset } from '../../actions';
import useRouter from '../../useRouter';
import Title from './Title';
import RaceToggle from './RaceToggle';
import PageSidebar from './PageSidebar';
// import FeatureVote from './FeatureVote';
import './CSS/Page.css';

const Page = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const selectedRace = useSelector(state => state.selectedRace);
    const [currentPage, setCurrentPage] = useState(null);
    // const [showFeatureVote, setShowFeatureVote] = useState(false);
    const [visibleState, setVisibleState] = useState(true);
    const router = useRouter(visibleState);
    const urlPrefix = useContext(UrlContext);

    const handleLogout = () => {
        const url = `${urlPrefix}api/logout/`;

        fetch(url, {
            method: 'GET',
            headers: { Authorization: `Token ${user.token}` },
        });

        localStorage.clear();
        dispatch(logoutReset());
    };

    const pages = {
        Replays: 'Replays',
        Trends: 'Weekly Trends',
        Upload: 'Upload Replays',
    };

    const capitalize = str => (
        str.charAt(0).toUpperCase() + str.slice(1)
    );

    return (
        <div className="Page">
            <header className="Page__header">
                <Title />
                {currentPage && currentPage !== 'Login' &&
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
                                {/* <Tippy
                                    className="Page__feature-vote-content"
                                    content={<FeatureVote />}
                                    placement="top-end"
                                    trigger="manual"
                                    maxWidth={360}
                                    visible={showFeatureVote}
                                    hideOnClick={false}
                                    interactive
                                >
                                    <div className="Page__feature-vote">
                                        <button
                                            className="Page__show-vote"
                                            onClick={() => (
                                                showFeatureVote ?
                                                    setShowFeatureVote(false) : setShowFeatureVote(true)
                                            )}
                                        >
                                            Vote on New Features&nbsp;
                                            <img
                                                className="Page__feature-vote-arrow"
                                                src="../../icons/arrow-right-black.svg"
                                                alt="show-feature-vote"
                                            />
                                        </button>
                                    </div>
                                </Tippy> */}
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
