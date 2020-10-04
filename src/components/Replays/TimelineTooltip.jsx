import React, { useEffect, useState } from 'react';

const TimelineTooltip = ({ payload, players, playerOrder, comparisonPlayer, gameloop, timeline }) => {
    const [currentTimeout, setCurrentTimeout] = useState(false);
    const [prevGameloop, setPrevGameloop] = useState(0);

    useEffect(() => {
        setTimeout(async () => {
            if (payload.length > 0) {
                setPrevGameloop(gameloop.current);
                gameloop.set(payload[0].payload[1].gameloop);
            }
            setCurrentTimeout(false);
        }, 100);
    }, [currentTimeout]);

    const timelineStatCategories = {
        'Workers Active': ['workers_active'],
        'Workers Lost': ['workers_killed'],
        'Unspent Resources': ['unspent_resources.minerals', 'unspent_resources.gas'],
    };

    const selectedStat = {
        'Collection Rate': ['resource_collection_rate.minerals', 'resource_collection_rate.gas'],
        'Army Value': ['army_value.minerals', 'army_value.gas'],
        'Resources Lost': ['resources_lost.minerals', 'resources_lost.gas'],
        'Resources Collected': ['resources_collected.minerals', 'resources_collected.gas'],
    };

    const checkSelectedStat = (stat) => {
        if (stat.includes('collection_rate')) {
            return 'Collection Rate';
        }

        if (stat.includes('army_value')) {
            return 'Army Value';
        }

        if (stat.includes('resources_lost')) {
            return 'Resources Lost';
        }

        if (stat.includes('resouces_collected')) {
            return 'Resources Collected';
        }
        return false;
    };

    const string2dot = (obj, str) => (
        str.split('.').reduce((o, i) => o[i], obj)
    );

    const formatCurrentTime = (tickGameloop) => {
        const totalSeconds = Math.floor(tickGameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1
            ? `${minutes}:0${seconds}`
            : `${minutes}:${seconds}`;
    };

    if (timeline.frozen) {
        // pass
    } else if (payload.length > 0) {
        const newGameloop = payload[0].payload[1].gameloop;
        if (!currentTimeout && newGameloop !== prevGameloop) {
            setCurrentTimeout(true);
        }
    }

    let content;
    if (payload.length > 0 && players && timeline.state) {
        content = (
            <div className="tooltip">
                <table>
                    <tbody>
                        <tr>
                            <td className="tooltip__current-time">
                                {formatCurrentTime(gameloop.current)}&nbsp;
                                <span>{timeline.frozen ? '(F)' : ''}</span>
                            </td>
                            <td className="tooltip__player tooltip__player--player1">
                                <svg
                                    className="tooltip__player-indicator"
                                    height="10"
                                    width="10"
                                >
                                    <circle
                                        cx="5"
                                        cy="5"
                                        r="5"
                                        fill="hsl(0, 100%, 55%)"
                                    />
                                </svg>
                                {players[playerOrder[0]].name}
                                &nbsp;({players[playerOrder[0]].race.slice(0, 1)})
                            </td>
                            <td className="tooltip__player tooltip__player--player1">
                                <svg
                                    className="tooltip__player-indicator"
                                    height="10"
                                    width="10"
                                >
                                    <circle
                                        cx="5"
                                        cy="5"
                                        r="5"
                                        fill="hsl(240, 80%, 55%)"
                                    />
                                </svg>
                                {players[playerOrder[1]].name}
                                &nbsp;({players[playerOrder[1]].race.slice(0, 1)})
                            </td>
                            {comparisonPlayer &&
                                <td className="tooltip__player tooltip__player--comparison">
                                    <svg
                                        className="tooltip__player-indicator"
                                        height="10"
                                        width="10"
                                    >
                                        <circle
                                            cx="5"
                                            cy="5"
                                            r="5"
                                            fill="hsl(0, 0%, 85%)"
                                        />
                                    </svg>
                                    {comparisonPlayer.name}
                                    &nbsp;({comparisonPlayer.race.slice(0, 1)})
                                </td>}
                        </tr>
                        {Object.entries(timelineStatCategories).map(([statName, statKeys]) => (
                            <tr key={`${statName}-row`} className="tooltip__timeline-stat">
                                <td key={`${statName}-name`} className="tooltip__stat-name">
                                    {statName}
                                </td>
                                <td key={`${statName}-values-1`} className="tooltip__stat-values">
                                    {statKeys.map((key, index) => (
                                        <span key={`${statName}-${key}-cell-1`} className="tooltip__value tooltip__value--player1">
                                            {string2dot(timeline.state[1], key)}&nbsp;
                                            {index === statKeys.length - 1 ? '' : '/ '}
                                        </span>
                                    ))}
                                </td>
                                <td key={`${statName}-values-2`} className="tooltip__stat-values">
                                    {statKeys.map((key, index) => (
                                        <span key={`${statName}-${key}-cell-2`} className="tooltip__value tooltip__value--player2">
                                            {string2dot(timeline.state[2], key)}&nbsp;
                                            {index === statKeys.length - 1 ? '' : '/ '}
                                        </span>
                                    ))}
                                </td>
                                {timeline.comparison &&
                                    <td key={`${statName}-values-3`} className="tooltip__stat-values">
                                        {statKeys.map((key, index) => (
                                            <span key={`${statName}-${key}-cell-3`} className="tooltip__value tooltip__value--comparison">
                                                {string2dot(timeline.comparison[comparisonPlayer.id], key)}&nbsp;
                                                {index === statKeys.length - 1 ? '' : '/ '}
                                            </span>
                                        ))}
                                    </td>}
                            </tr>
                        ))}
                        {checkSelectedStat(timeline.stat) &&
                            <tr className="tooltip__timeline-stat">
                                <td className="tooltip__stat-name">
                                    {checkSelectedStat(timeline.stat)}
                                </td>
                                <td className="tooltip__stat-values">
                                    {selectedStat[checkSelectedStat(timeline.stat)].map((key, index) => (
                                        <span key={`${key}-${index}`} className="tooltip__value tooltip__value--player1">
                                            {string2dot(timeline.state[1], key)}&nbsp;
                                            {index === selectedStat[checkSelectedStat(timeline.stat)].length - 1 ? '' : '/ '}
                                        </span>
                                    ))}
                                </td>
                                <td className="tooltip__stat-values">
                                    {selectedStat[checkSelectedStat(timeline.stat)].map((key, index) => (
                                        <span key={`${key}-${index}`} className="tooltip__value tooltip__value--player2">
                                            {string2dot(timeline.state[2], key)}&nbsp;
                                            {index === selectedStat[checkSelectedStat(timeline.stat)].length - 1 ? '' : '/ '}
                                        </span>
                                    ))}
                                </td>
                                {timeline.comparison &&
                                    <td className="tooltip__stat-values">
                                        {selectedStat[checkSelectedStat(timeline.stat)].map((key, index) => (
                                            <span className="tooltip__value tooltip__value--comparison">
                                                {string2dot(timeline.comparison[comparisonPlayer.id], key)}&nbsp;
                                                {index === selectedStat[checkSelectedStat(timeline.stat)].length - 1 ? '' : '/ '}
                                            </span>
                                        ))}
                                    </td>}
                            </tr>}
                    </tbody>
                </table>
            </div>
        );
    } else {
        content = null;
    }

    return (
        <div id="tooltip">
            {content}
        </div>
    );
};

export default TimelineTooltip;
