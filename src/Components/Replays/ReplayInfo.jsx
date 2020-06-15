import { useState, useContext } from 'react';
import UrlContext from '../../index';
import './CSS/ReplayInfo.css';

const ReplayInfo = ({ replay, timeline, clanTagIndex }) => {
    const [timelineStatDropdown, setTimelineStatDropdown] = useState(0);
    const urlPrefix = useContext(UrlContext);

    const timelineStatCategories = {
        resource_collection_rate_all: 'Total Collection Rate',
        'resource_collection_rate.minerals': 'Mineral Collection Rate',
        'resource_collection_rate.gas': 'Gas Collection Rate',
        'unspent_resources.minerals': 'Unspent Minerals',
        'unspent_resources.gas': 'Unspent Gas',
        total_army_value: 'Total Army Value',
        'army_value.minerals': 'Mineral Army Value',
        'army_value.gas': 'Gas Army Value',
        total_resources_lost: 'Total Resources Lost',
        'resources_lost.minerals': 'Minerals Lost',
        'resources_lost.gas': 'Gas Lost',
        workers_active: 'Workers Active',
        workers_killed: 'Workers Lost',
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
                {replay.played_at.slice(0, 1)} Months Ago
            </span>
            <span className="ReplayInfo__result">
                {replay.win ?
                    <span className="ReplayInfo__result--win">Win</span>
                    :
                    <span className="ReplayInfo__result--loss">Loss</span>
                }
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
            <div className="ReplayInfo__stat-select">
                <button
                    className="ReplayInfo__stat-toggle"
                    onClick={() => (
                        timelineStatDropdown === 1 ?
                            setTimelineStatDropdown(0) : setTimelineStatDropdown(1)
                    )}
                >
                    {timelineStatCategories[timeline.stat]}
                    <img
                        className="ReplayInfo__selection-arrow"
                        src="../../icons/down-arrow.svg"
                        alt=""
                    />
                </button>
                <ul
                    style={{
                        opacity: timelineStatDropdown,
                        zIndex: timelineStatDropdown,
                        maxHeight: timelineStatDropdown === 0 ? '0px' : '400px',
                    }}
                    className={`ReplayInfo__stat-dropdown 
                        ${timelineStatDropdown === 1 ? 'ReplayInfo__stat-dropdown--open' : ''}`}
                >
                    {Object.entries(timelineStatCategories).map(([statKey, statName]) => (
                        <li key={statName} className="ReplayInfo__dropdown-option">
                            <button
                                key={statName}
                                className="ReplayInfo__dropdown-button"
                                onClick={() => {
                                    timeline.setStat(statKey);
                                    localStorage.timelineStat = statKey;
                                }}
                            >
                                {statName}&nbsp;&nbsp;
                                <svg height="10" width="10">
                                    <circle
                                        className="ReplayInfo__stat-dropdown-indicator"
                                        cx="5"
                                        cy="5"
                                        r="5"
                                        fill="hsl(210, 68%, 47%)"
                                        opacity={
                                            statKey === timeline.stat ?
                                                '1' : '0'
                                        }
                                    />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ReplayInfo;
