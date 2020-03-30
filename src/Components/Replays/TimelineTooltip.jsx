import { useEffect, useState } from 'react';

const TimelineTooltip = (props) => {
    const [currentTimeout, setCurrentTimeout] = useState(false);
    const [prevGameloop, setPrevGameloop] = useState(0);

    useEffect(() => {
        setTimeout(async () => {
            if (props.payload.length > 0) {
                setPrevGameloop(props.gameloop);
                props.setGameloop(props.payload[0].payload[1].gameloop);
            }
            setCurrentTimeout(false);
        }, 100);
    }, [currentTimeout]);

    const timelineStatCategories = {
        'Workers Active': ['workers_active'],
        'Workers Lost': ['workers_killed'],
        'Collection Rate': ['resource_collection_rate.minerals', 'resource_collection_rate.gas'],
        'Army Value': ['army_value.minerals', 'army_value.gas'],
        'Resources Lost': ['resources_lost.minerals', 'resources_lost.gas'],
    };

    const string2dot = (obj, str) => (
        str.split('.').reduce((o, i) => o[i], obj)
    );

    const formatCurrentTime = (gameloop) => {
        const totalSeconds = Math.floor(gameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1 ?
            `${minutes}:0${seconds}`
            :
            `${minutes}:${seconds}`;
    };

    if (props.isTimelineFrozen) {
        // pass
    } else if (props.payload.length > 0) {
        const gameloop = props.payload[0].payload[1].gameloop;
        if (!currentTimeout && gameloop !== prevGameloop) {
            setCurrentTimeout(true);
        }
    }

    let content;
    const playerColours = {
        1: 'red',
        2: 'blue',
    };

    if (props.payload.length > 0 && props.players && props.currentTimelineState) {
        content = (
            <div className="tooltip">
                <table>
                    <tbody>
                        <tr>
                            <td className="tooltip__current-time">
                                {formatCurrentTime(props.gameloop)}&nbsp;
                                <span>{props.isTimelineFrozen ? '(F)' : ''}</span>
                            </td>
                            {Object.keys(playerColours).map(playerId => (
                                <td key={`player-${playerId}`} className={`tooltip__player tooltip__player--player${playerId}`}>
                                    <svg
                                        className="tooltip__player-indicator"
                                        height="10"
                                        width="10"
                                    >
                                        <circle
                                            cx="5"
                                            cy="5"
                                            r="5"
                                            fill={playerColours[playerId]}
                                        />
                                    </svg>
                                    {props.players[playerId].name}
                                    &nbsp;({props.players[playerId].race.slice(0, 1)})
                                </td>
                            ))}
                            {/* {props.comparisonPlayer &&
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
                                    {props.comparisonPlayer.name}
                                    &nbsp;({props.comparisonPlayer.race.slice(0, 1)})
                                </td>} */}
                        </tr>
                        {Object.entries(timelineStatCategories).map(([statName, statKeys]) => (
                            <tr key={`${statName}-row`} className="tooltip__timeline-stat">
                                <td key={`${statName}-name`} className="tooltip__stat-name">
                                    {statName}
                                </td>
                                {Object.keys(playerColours).map(playerId => (
                                    <td key={`${statName}-values-${playerId}`} className="tooltip__stat-values">
                                        {statKeys.map((key, index) => {
                                            let compareStat;
                                            let statDiff;
                                            let diffClass;
                                            if (props.currentTimelineState.comparison && /* statKeys.length === 1 && */ props.userMatchId == playerId) { /* eslint-disable-line eqeqeq */
                                                compareStat = true;
                                                statDiff = string2dot(props.currentTimelineState[playerId], key) - string2dot(props.currentTimelineState.comparison[props.comparisonPlayer.id], key);
                                                diffClass = statDiff >= 0 ? `tooltip__stat-comparison-diff--positive tooltip__stat-comparison-diff--${key}-positive` : `tooltip__stat-comparison-diff--negative tooltip__stat-comparison-diff--${key}-negative`;
                                            }

                                            return (
                                                <span key={`${statName}-${key}-cell-${playerId}`} className={`tooltip__value tooltip__value--player${playerId}`}>
                                                    {string2dot(props.currentTimelineState[playerId], key)}&nbsp;
                                                    {compareStat &&
                                                        <span className={diffClass}>
                                                            {statDiff >= 0 ? `+${statDiff}` : statDiff}&nbsp;
                                                        </span>}
                                                    {index === statKeys.length - 1 ? '' : '/ '}
                                                </span>
                                            );
                                        })}
                                    </td>
                                ))}
                                {/* {props.currentTimelineState.comparison &&
                                    <td key={`${statName}-values-3`} className="tooltip__stat-values">
                                        {statKeys.map((key, index) => (
                                            <span key={`${statName}-${key}-cell-3`} className="tooltip__value tooltip__value--comparison">
                                                {string2dot(props.currentTimelineState.comparison[props.comparisonPlayer.id], key)}&nbsp;
                                                {index === statKeys.length - 1 ? '' : '/ '}
                                            </span>
                                        ))}
                                    </td>} */}
                            </tr>
                        ))}
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
