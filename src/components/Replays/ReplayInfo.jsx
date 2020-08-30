import React, { useContext } from 'react';
import UrlContext from '../../index';
import './CSS/ReplayInfo.css';

const ReplayInfo = ({ replay, clanTagIndex }) => {
    const urlPrefix = useContext(UrlContext);

    return (
        <div className="ReplayInfo__title-area">
            <h2 className="ReplayInfo__matchup">
                {`${replay.players[1].race.slice(0, 1)}v${replay.players[2].race.slice(0, 1)}`}
            </h2>
            <h2 className="ReplayInfo__map">
                {replay.map}
            </h2>
            <span className="ReplayInfo__date">
                {replay.played_at.slice(0, 1)} Months Ago
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
