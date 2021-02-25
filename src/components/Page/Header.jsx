import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleState } from '../../actions';
import { capitalize } from '../../utils';
import RaceToggle from './RaceToggle';
import FeedbackModal from './FeedbackModal';
import { PAGES } from '../../constants';

const Header = ({ currentPage, visibleState }) => {
    const dispatch = useDispatch();
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
            </Fragment>
    );
};

export default Header;
