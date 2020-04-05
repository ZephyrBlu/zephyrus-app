import { useState } from 'react';
import './CSS/ReplayInfo.css';

const ReplayInfo = (props) => {
    const [timelineStatDropdown, setTimelineStatDropdown] = useState(0);

    const selectedReplay = props.selectedReplay;
    const timelineStatCategories = {
        resource_collection_rate_all: 'Total Collection Rate',
        'resource_collection_rate.minerals': 'Mineral Collection Rate',
        'resource_collection_rate.gas': 'Gas Collection Rate',
        total_army_value: 'Total Army Value',
        'army_value.minerals': 'Mineral Army Value',
        'army_value.gas': 'Gas Army Value',
        total_resources_lost: 'Total Resources Lost',
        'resources_lost.minerals': 'Minerals Lost',
        'resources_lost.gas': 'Gas Lost',
        workers_active: 'Workers Active',
        workers_killed: 'Workers Lost',
    };

    let urlPrefix;
    if (process.env.NODE_ENV === 'development') {
        urlPrefix = 'http://127.0.0.1:8000/';
    } else {
        urlPrefix = 'https://zephyrus.gg/';
    }

    return (
        <div className="ReplayInfo__title-area">
            <h2 className="ReplayInfo__matchup">
                {`${selectedReplay.players[1].race.slice(0, 1)}v${selectedReplay.players[2].race.slice(0, 1)}`}
            </h2>
            <h2 className="ReplayInfo__map">
                {selectedReplay.map}
            </h2>
            <span className="ReplayInfo__date">
                {selectedReplay.played_at.slice(0, 1)} Months Ago
            </span>
            <span className="ReplayInfo__result">
                {selectedReplay.win ?
                    <span className="ReplayInfo__result--win">Win</span>
                    :
                    <span className="ReplayInfo__result--loss">Loss</span>
                }
                {`\xa0\xa0\xa0\xa0${Math.ceil(selectedReplay.match_length / 60)} min`}
            </span>
            <div className="ReplayInfo__players">
                <div
                    className={
                        `ReplayInfo__player-info ReplayInfo__player-info--player1
                        ${selectedReplay.user_match_id === 1 ? 'ReplayInfo__player-info--user' : ''}`
                    }
                >
                    <span className="ReplayInfo__player ReplayInfo__player--1">Player 1</span>
                    <h2 className="ReplayInfo__player-name">
                        {selectedReplay.players[1].name.slice(props.clanTagIndex(selectedReplay.players[1].name))}
                    </h2>
                </div>
                <div
                    className={
                        `ReplayInfo__player-info ReplayInfo__player-info--player2
                        ${selectedReplay.user_match_id === 2 ? 'ReplayInfo__player-info--user' : ''}`
                    }
                >
                    <span className="ReplayInfo__player ReplayInfo__player--2">Player 2</span>
                    <h2 className="ReplayInfo__player-name">
                        {selectedReplay.players[2].name.slice(props.clanTagIndex(selectedReplay.players[2].name))}
                    </h2>
                </div>
            </div>
            <a
                className="ReplayInfo__replay-download"
                href={`${urlPrefix}api/download/${props.selectedReplay.file_hash}/`}
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
                    value={`${urlPrefix}replay/${selectedReplay.url}`}
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
                    {timelineStatCategories[props.timelineStat]}
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
                                    props.setTimelineStat(statKey);
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
                                            statKey === props.timelineStat ?
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
