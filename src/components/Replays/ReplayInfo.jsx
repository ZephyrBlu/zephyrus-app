import React, { useContext } from 'react';
import UrlContext from '../../index';
import './CSS/ReplayInfo.css';

const ReplayInfo = ({ replay, clanTagIndex }) => {
    const urlPrefix = useContext(UrlContext);

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
        <div className="ReplayInfo__title-area">
            <h2 className="ReplayInfo__matchup">
                {`${replay.players[1].race.slice(0, 1)}v${replay.players[2].race.slice(0, 1)}`}
            </h2>
            <h2 className="ReplayInfo__map">
                {replay.map}
            </h2>
            <span className="ReplayInfo__date">
                {formatDate(replay.played_at)}
            </span>
            <span className="ReplayInfo__result">
                {replay.win ?
                    <span className="ReplayInfo__result--win">Win</span>
                    :
                    <span className="ReplayInfo__result--loss">Loss</span>}
                {`\xa0\xa0\xa0\xa0${Math.ceil(replay.match_length / 60)} min`}
            </span>
            <div className="ReplayInfo__players">
                <div
                    className={
                        `ReplayInfo__player-info ReplayInfo__player-info--player1
                        ${replay.user_match_id === 1 ? 'ReplayInfo__player-info--user' : ''}`
                    }
                >
                    <span className="ReplayInfo__player ReplayInfo__player--1">Player 1</span>
                    <h2 className="ReplayInfo__player-name">
                        {replay.players[1].name.slice(clanTagIndex(replay.players[1].name))}
                    </h2>
                </div>
                <div
                    className={
                        `ReplayInfo__player-info ReplayInfo__player-info--player2
                        ${replay.user_match_id === 2 ? 'ReplayInfo__player-info--user' : ''}`
                    }
                >
                    <span className="ReplayInfo__player ReplayInfo__player--2">Player 2</span>
                    <h2 className="ReplayInfo__player-name">
                        {replay.players[2].name.slice(clanTagIndex(replay.players[2].name))}
                    </h2>
                </div>
            </div>
            <a
                className="ReplayInfo__replay-download"
                href={`${urlPrefix}api/download/${replay.file_hash}/`}
                download
            >
                Download Replay
            </a>
            <span className="ReplayInfo__share-replay">
                <label htmlFor="share-replay" className="ReplayInfo__replay-label">
                    Share
                </label>
                <input
                    id="share-replay"
                    className="ReplayInfo__replay-url"
                    type="text"
                    onClick={e => e.target.select()}
                    onFocus={e => e.target.select()}
                    value={`${urlPrefix}replay/${replay.url}`}
                    readOnly
                />
            </span>
        </div>
    );
};

export default ReplayInfo;
