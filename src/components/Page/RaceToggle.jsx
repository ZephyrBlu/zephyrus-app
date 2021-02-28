import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedRace, setSelectedReplayHash } from '../../actions';
import './CSS/RaceToggle.css';

const RaceToggle = () => {
    const dispatch = useDispatch();
    const selectedRace = useSelector(state => state.selectedRace);

    const raceToggleStyle = {
        protoss: { marginLeft: '5px', opacity: '1' },
        zerg: { marginLeft: '61px', opacity: '1' },
        terran: { marginLeft: '117px', opacity: '1' },
        null: { opacity: '0' },
    };

    return (
        <div className="RaceToggle">
            <div
                className="RaceToggle__toggle-indicator"
                style={raceToggleStyle[selectedRace]}
            />
            <button
                className="RaceToggle__toggle-button"
                onClick={() => {
                    dispatch(updateSelectedRace('protoss'));
                    dispatch(setSelectedReplayHash(null));
                }}
            >
                <img
                    src="../../icons/protoss-logo.svg"
                    alt="Protoss"
                    className="RaceToggle__race-icon"
                />
            </button>
            <button
                className="RaceToggle__toggle-button"
                onClick={() => {
                    dispatch(updateSelectedRace('zerg'));
                    dispatch(setSelectedReplayHash(null));
                }}
            >
                <img
                    src="../../icons/zerg-logo.svg"
                    alt="Zerg"
                    className="RaceToggle__race-icon"
                />
            </button>
            <button
                className="RaceToggle__toggle-button"
                onClick={() => {
                    dispatch(updateSelectedRace('terran'));
                    dispatch(setSelectedReplayHash(null));
                }}
            >
                <img
                    src="../../icons/terran-logo.svg"
                    alt="Terran"
                    className="RaceToggle__race-icon"
                />
            </button>
        </div>
    );
};

export default RaceToggle;
