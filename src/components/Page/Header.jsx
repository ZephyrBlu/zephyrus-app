import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { capitalize } from '../../utils';
import RaceToggle from './RaceToggle';
import FeedbackModal from './FeedbackModal';
import { PAGES } from '../../constants';

const Header = ({ currentPage, isReplayListVisible, setIsReplayListVisible }) => {
    const selectedRace = useSelector(state => state.selectedRace);

    return (
        currentPage && currentPage !== 'Login' && currentPage !== 'Settings' &&
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
                        {isReplayListVisible ? 'Hide Replays' : ''}
                        <button
                            className="Page__hide-side-bar"
                            onClick={() => setIsReplayListVisible(prevState => !prevState)}
                        >
                            <img
                                className="Page__hide-icon"
                                src="../../icons/arrow-right.svg"
                                alt="hide-button"
                                style={isReplayListVisible ? {} : { transform: 'rotate(180deg)' }}
                            />
                        </button>
                    </span>}
            </Fragment>
    );
};

export default Header;
