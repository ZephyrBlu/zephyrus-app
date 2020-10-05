import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { setSelectedReplayHash } from '../../actions';
import './CSS/ReplayRecord.css';

const ReplayRecord = ({ hash, comparisonHash, stats }) => {
    const dispatch = useDispatch();
    const selectedReplayHash = useSelector(state => state.selectedReplayHash);

    const handleReplaySelection = (e) => {
        // return when we just want to compare a replay
        if (e.target.classList.contains('ReplayRecord__compare-replay')) {
            return;
        }
        dispatch(setSelectedReplayHash(hash));
    };

    const handleKeyDown = (key) => {
        if (key === 'Enter') {
            handleReplaySelection();
        }
    };

    const formatDate = (date) => {
        const formatString = () => {
            const strPieces = date.split('*');
            const [start] = strPieces;
            let fraction;

            switch (strPieces[1].slice(0, 1)) {
                case '1':
                    fraction = '\xBC';
                    break;

                case '2':
                    fraction = '\xBD';
                    break;

                case '3':
                    fraction = '\xBE';
                    break;

                default:
                    break;
            }
            return [start, fraction];
        };

        if (date.indexOf('*') !== -1) {
            const [start, fraction] = formatString();
            return `${start.trim()}${fraction} Months ago`;
        }

        if (date.slice(1, 2) === 'm') {
            return `${date.slice(0, 1)} Months ago`;
        }

        if (date.slice(2, 3) === 'm') {
            return `${date.slice(0, 2)} Months ago`;
        }

        if (date.slice(1, 2) === 'w') {
            return `${date.slice(0, 1)} Weeks Ago`;
        }

        if (date.slice(1, 2) === 'd') {
            return `${date.slice(0, 1)} Days Ago`;
        }
        return date;
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={`
                ReplayRecord
                ReplayRecord--${stats.result.toLowerCase().split(',')[0]}
                ${selectedReplayHash && selectedReplayHash === hash ? 'ReplayRecord--selected' : ''}
                ${comparisonHash && comparisonHash === hash ? 'ReplayRecord--comparison' : ''}
            `}
            onClick={handleReplaySelection}
            onKeyDown={e => handleKeyDown(e.key)}
        >
            <div className="ReplayRecord__matchup">
                <img
                    src={`../../icons/${stats.players[1].race.toLowerCase()}-logo.svg`}
                    alt={stats.players[1].race}
                    className="ReplayRecord__matchup-race-icon"
                />
                vs
                <img
                    src={`../../icons/${stats.players[2].race.toLowerCase()}-logo.svg`}
                    alt={stats.players[2].race}
                    className="ReplayRecord__matchup-race-icon"
                />
            </div>
            <div className="ReplayRecord__match-info">
                {/* <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--matchup">
                    {stats.matchup}
                </span> */}
                <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--map">
                    {stats.map}
                </span>
                <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--match-length">
                    {stats.matchLength} min
                </span>
                <span className={`ReplayRecord__match-info-field ReplayRecord__match-info-field--result ReplayRecord__match-info-field--${stats.result.toLowerCase().split(',')[0]}`}>
                    {stats.result.split(',')[0]}
                </span>
            </div>
            <span className="ReplayRecord__match-info-field--date">
                {formatDate(stats.date)}
            </span>
            <div className="ReplayRecord__match-players">
                <div className={`ReplayRecord__player ReplayRecord__player--${stats.players[1].race}`}>
                    <img
                        src={`../../icons/${stats.players[1].race.toLowerCase()}-logo.svg`}
                        alt={stats.players[1].race}
                        className="ReplayRecord__player-race-icon"
                    />
                    <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--name">
                        {stats.players[1].name}
                    </span>
                    <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--mmr">
                        {stats.players[1].mmr}
                    </span>
                </div>
                <div className={`ReplayRecord__player ReplayRecord__player--${stats.players[2].race}`}>
                    <img
                        src={`../../icons/${stats.players[2].race.toLowerCase()}-logo.svg`}
                        alt={stats.players[2].race}
                        className="ReplayRecord__player-race-icon"
                    />
                    <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--name">
                        {stats.players[2].name}
                    </span>
                    <span className="ReplayRecord__match-info-field ReplayRecord__match-info-field--mmr">
                        {stats.players[2].mmr}
                    </span>
                </div>
            </div>
            {/* {selectedReplayHash && hash !== selectedReplayHash &&
                <Fragment>
                    <button onClick={() => compareReplay(hash, 1)} className="ReplayRecord__compare-replay ReplayRecord__compare-replay--player1">
                        &#43;
                    </button>
                    <button onClick={() => compareReplay(hash, 2)} className="ReplayRecord__compare-replay ReplayRecord__compare-replay--player2">
                        &#43;
                    </button>
                </Fragment>} */}
        </div>
    );
};

export default ReplayRecord;
