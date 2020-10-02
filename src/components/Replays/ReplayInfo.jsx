import React, { useContext } from 'react';
import UrlContext from '../../index';
import './CSS/ReplayInfo.css';

const ReplayInfo = ({ replay, clanTagIndex }) => {
    const urlPrefix = useContext(UrlContext);
    const userId = replay.user_match_id;
    const oppId = userId === 1 ? 2 : 1;

    const formatDate = (date) => {
        const formatString = () => {
            const strPieces = date.split('*');
            const [start] = strPieces;
            let fraction;

            switch (strPieces[userId].slice(0, 1)) {
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
        <div className="ReplayInfo">
            <div className={`ReplayInfo__opponent-race ReplayInfo__opponent-race--${replay.players[oppId].race}`}>
                <img
                    src={`../../icons/${replay.players[oppId].race.toLowerCase()}-logo.svg`}
                    alt={replay.players[oppId].race}
                    className="ReplayInfo__opponent-race-icon"
                />
                vs {replay.players[oppId].race}
            </div>
            <div className="ReplayInfo__match-info">
                <span className="ReplayInfo__matchup">
                    {`${replay.players[userId].race.slice(0, 1)}v${replay.players[oppId].race.slice(0, 1)}`}
                </span>
                <span className="ReplayInfo__map">
                    {replay.map}
                </span>
                <span className="ReplayInfo__match-length">
                    {Math.ceil(replay.match_length / 60)} min
                </span>
            </div>
            <span className="ReplayInfo__date">
                {formatDate(replay.played_at)}
            </span>
            <div className="ReplayInfo__players">
                <div className={`ReplayInfo__player ReplayInfo__player--${replay.players[userId].race}`}>
                    <img
                        src={`../../icons/${replay.players[userId].race.toLowerCase()}-logo.svg`}
                        alt={replay.players[userId].race}
                        className="ReplayInfo__player-race-icon"
                    />
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--name">
                        {replay.players[userId].name.slice(clanTagIndex(replay.players[userId].name))}
                    </span>
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--mmr">
                        {replay.players[userId].mmr}
                    </span>
                </div>
                <div className={`ReplayInfo__player ReplayInfo__player--${replay.players[oppId].race}`}>
                    <img
                        src={`../../icons/${replay.players[oppId].race.toLowerCase()}-logo.svg`}
                        alt={replay.players[oppId].race}
                        className="ReplayInfo__player-race-icon"
                    />
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--name">
                        {replay.players[oppId].name.slice(clanTagIndex(replay.players[oppId].name))}
                    </span>
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--mmr">
                        {replay.players[oppId].mmr}
                    </span>
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
