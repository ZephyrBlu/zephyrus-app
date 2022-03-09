import React from 'react';
import { clanTagIndex } from '../../utils';
import { URL_PREFIX } from '../../constants';
import './CSS/ReplayInfo.css';

const ReplayInfo = ({ replay, isReplayListVisible }) => {
    const userId = replay.data.user_match_id;
    const oppId = userId === 1 ? 2 : 1;

    return (
        <div className={`ReplayInfo ${isReplayListVisible ? 'ReplayInfo--replays' : ''}`}>
            <span className={`ReplayInfo__result ReplayInfo__result--${replay.data.win ? 'win' : 'loss'}`}>
                {replay.data.win ? 'Win' : 'Loss'}
            </span>
            <div className="ReplayInfo__match-info">
                <span className="ReplayInfo__matchup">
                    {`${replay.data.players[userId].race.slice(0, 1)}v${replay.data.players[oppId].race.slice(0, 1)}`}
                </span>
                <span className="ReplayInfo__map">
                    {replay.data.map}
                </span>
                <span className="ReplayInfo__match-length">
                    {Math.ceil(replay.data.match_length / 60)} min
                </span>
            </div>
            <div className="ReplayInfo__players">
                <div className="ReplayInfo__player">
                    <img
                        src={`../../icons/${replay.data.players[userId].race.toLowerCase()}-logo.svg`}
                        alt={replay.data.players[userId].race}
                        className="ReplayInfo__player-race-icon"
                    />
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--name">
                        {replay.data.players[userId].name.slice(clanTagIndex(replay.data.players[userId].name))}
                    </span>
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--mmr">
                        {replay.info.mmr[userId]}
                    </span>
                </div>
                <div className="ReplayInfo__player">
                    <img
                        src={`../../icons/${replay.data.players[oppId].race.toLowerCase()}-logo.svg`}
                        alt={replay.data.players[oppId].race}
                        className="ReplayInfo__player-race-icon"
                    />
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--name">
                        {replay.data.players[oppId].name.slice(clanTagIndex(replay.data.players[oppId].name))}
                    </span>
                    <span className="ReplayInfo__match-info-field ReplayInfo__match-info-field--mmr">
                        {replay.info.mmr[oppId]}
                    </span>
                </div>
            </div>
            <a
                className="ReplayInfo__replay-download"
                href={`${URL_PREFIX}api/download/${replay.data.file_hash}/`}
                download
            >
                Download
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
                    value={`${URL_PREFIX}replay/${replay.data.url}`}
                    readOnly
                />
            </span>
        </div>
    );
};

export default ReplayInfo;
