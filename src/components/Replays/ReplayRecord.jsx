import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment } from 'react';
import { setSelectedReplayHash } from '../../actions';
import './CSS/ReplayRecord.css';

const ReplayRecord = ({ hash, stats, compareReplay }) => {
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
            className={
                selectedReplayHash && selectedReplayHash === hash ?
                    `
                        ReplayRecord
                        ReplayRecord--${stats.result.toLowerCase().split(',')[0]}
                        ReplayRecord--selected
                    `
                    :
                    `
                        ReplayRecord
                        ReplayRecord--${stats.result.toLowerCase().split(',')[0]}
                    `
            }
            onClick={handleReplaySelection}
            onKeyDown={e => handleKeyDown(e.key)}
        >
            {Object.keys(stats).map(replayInfoField => (
                <span
                    key={`${replayInfoField}`}
                    className={`ReplayRecord__${replayInfoField}`}
                >
                    {replayInfoField === 'result' ? // eslint-disable-line no-nested-ternary
                        <Fragment>
                            <span className={`ReplayRecord__stat--${
                                stats[replayInfoField].split(',')[0] === 'Win' ?
                                    'win' : 'loss'}`}
                            >
                                {stats[replayInfoField].split(',')[0]}
                            </span>
                            <span>
                                {stats[replayInfoField].split(',')[1]} min
                            </span>
                        </Fragment>
                        :
                        replayInfoField === 'date'
                            ? formatDate(stats[replayInfoField])
                            : stats[replayInfoField]}
                </span>
            ))}
            <button onClick={() => compareReplay(hash, 1)} className="ReplayRecord__compare-replay ReplayRecord__compare-replay--player1">
                &#43;
            </button>
            <button onClick={() => compareReplay(hash, 2)} className="ReplayRecord__compare-replay ReplayRecord__compare-replay--player2">
                &#43;
            </button>
        </div>
    );
};

export default ReplayRecord;
