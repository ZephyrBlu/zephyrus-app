import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    Tooltip,
    Line,
} from 'recharts';
import React, { Fragment, useState, useEffect } from 'react';
import RaceState from './RaceState';
import ObjectState from './ObjectState';
// import CurrentSelectionState from './CurrentSelectionState';
import UpgradeState from './UpgradeState';
import TimelineTooltip from './TimelineTooltip';
import './CSS/TimelineArea.css';

const TimelineArea = ({ replay, timeline, gameloop, players, visibleState }) => {
    const [isTimelineFrozen, setTimelineState] = useState(false);
    const [playerOrder, setPlayerOrder] = useState(null);
    const currentTimelineState = timeline.cached[gameloop.current];
    const currentComparisonTimelineState = timeline.comparison.cached
        ? timeline.comparison.cached[gameloop.current]?.comparison
        : null;

    useEffect(() => {
        const userId = replay.info.user_match_id;
        const oppId = userId === 1 ? 2 : 1;
        setPlayerOrder([userId, oppId]);
    }, []);

    const formatTick = (content) => {
        const totalSeconds = Math.floor(Number(content) / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        if (String(seconds).length === 1) {
            return `${minutes}:0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    };

    const formatCurrentTime = (tickGameloop) => {
        const totalSeconds = Math.floor(tickGameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1 ?
            `${minutes}:0${seconds}`
            :
            `${minutes}:${seconds}`;
    };

    const timelineStatCategories = {
        resource_collection_rate_all: ['Collection Rate', 'resource_collection_rate'],
        // 'unspent_resources.minerals': 'Unspent Minerals',
        // 'unspent_resources.gas': 'Unspent Gas',
        total_army_value: ['Army Value', 'army_value'],
        total_resources_lost: ['Resources Lost', 'resources_lost'],
        total_resouces_collected: ['Resources Collected', 'resources_collected'],
        // 'resources_lost.minerals': 'Minerals Lost',
        // 'resources_lost.gas': 'Gas Lost',
        // workers_active: 'Workers Active',
        // workers_killed: 'Workers Lost',
    };

    const objectStates = {
        unit: ['live', 'died'],
        building: ['live', 'died', 'in_progress'],
    };

    const ignoreObjects = {
        unit: ['BroodlingEscort'],
        building: ['CreepTumor', 'CreepTumorQueen'],
    };

    return (
        playerOrder &&
        <div className="TimelineArea">
            <div className="TimelineArea__chart-area">
                <ResponsiveContainer className="TimelineArea__timeline" width="99%" height="99%">
                    <LineChart
                        data={timeline.spliced || timeline.data}
                        margin={{ left: 30, right: 20 }}
                        onClick={
                            () => (
                                isTimelineFrozen ?
                                    setTimelineState(false) : setTimelineState(true)
                            )
                        }
                    >
                        <XAxis
                            dataKey="1.gameloop"
                            tickFormatter={content => formatTick(content)}
                            hide
                        />
                        <Tooltip
                            content={
                                <TimelineTooltip
                                    timeline={{
                                        stat: timeline.stat,
                                        state: currentTimelineState,
                                        comparison: currentComparisonTimelineState,
                                        frozen: isTimelineFrozen,
                                    }}
                                    gameloop={gameloop}
                                    players={players}
                                    playerOrder={playerOrder}
                                    comparisonPlayer={timeline.comparison.player}
                                />
                            }
                            position={{ y: -10 }}
                        />
                        <Line
                            type="monotone"
                            dataKey={`${playerOrder[0]}.${timeline.stat}`}
                            stroke="hsl(0, 100%, 55%)"
                            activeDot={{ stroke: 'hsl(0, 100%, 55%)', fill: 'hsl(0, 100%, 55%)' }}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey={`${playerOrder[1]}.${timeline.stat}`}
                            stroke="hsl(240, 80%, 55%)"
                            activeDot={{ stroke: 'hsl(240, 80%, 55%)', fill: 'hsl(240, 80%, 55%)' }}
                            dot={false}
                        />
                        {timeline.comparison.player && timeline.comparison.player.id &&
                            <Line
                                type="monotone"
                                dataKey={`comparison.${timeline.comparison.player.id}.${timeline.stat}`}
                                stroke="hsl(0, 0%, 85%)"
                                activeDot={{ stroke: 'hsl(0, 0%, 85%)', fill: 'hsl(0, 0%, 85%)' }}
                                dot={false}
                            />}
                    </LineChart>
                </ResponsiveContainer>
                <div className="TimelineArea__chart-selector">
                    {Object.entries(timelineStatCategories).map(([statKey, statNames]) => (
                        <button
                            key={statKey}
                            className={`TimelineArea__chart-stat ${timeline.stat === statKey ? 'TimelineArea__chart-stat--active' : ''}`}
                            onClick={() => {
                                timeline.setStat(statKey);
                                localStorage.timelineStat = statKey;
                            }}
                        >
                            {statNames[0]}
                        </button>
                    ))}
                </div>
                {/* {metrics &&
                    Object.entries(metrics).map(([statKey, values]) => { // eslint-disable-line arrow-body-style
                        // const aheadOrBehind = values.summary.ahead - values.summary.behind >= 0 ? 'ahead' : 'behind';
                        // const avgAheadOrBehind = values.summary.ahead - values.summary.behind >= 0 ? values.summary.avgAhead : values.summary.avgBehind;

                        return (
                            <div className={`TimelineArea__metric TimelineArea__metric--${statKey}`}>
                                <h3 className="TimelineArea__metric-stat">
                                    {timelineStatCategories[statKey][0]}
                                </h3>
                                <ResponsiveContainer className="TimelineArea__metric-chart" width="80%" height={50}>
                                    <LineChart data={values.data} margin={{ top: 5, bottom: 5 }}>
                                        <ReferenceLine y={0} stroke="hsl(0, 0%, 47%)" strokeWidth={0.5} />
                                        <YAxis domain={[-1.05, 1.05]} allowDataOverflow hide />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="hsl(210, 68%, 47%)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                                <p className="TimelineArea__metric-value">
                                    You were {aheadOrBehind} {values.summary[aheadOrBehind]}% of the time
                                </p>
                                <p className="TimelineArea__metric-value">
                                    On average, {aheadOrBehind} by {avgAheadOrBehind[0]}
                                    &nbsp;({aheadOrBehind === 'ahead' ? '' : '-'}{avgAheadOrBehind[1]}%)
                                </p>
                                <p className="TimelineArea__metric-value">
                                    {values.summary.avgLeadLag[0] >= 0 ? 'Led' : 'Lagged'} by&nbsp;
                                    {Math.abs(values.summary.avgLeadLag[0])}
                                    &nbsp;({values.summary.avgLeadLag[0] >= 0 ? '+' : ''}
                                    {values.summary.avgLeadLag[1]}%) on average
                                </p>
                            </div>
                        );
                    })} */}
            </div>
            <div className="timeline-state">
                <div className="timeline-state__players">
                    {currentTimelineState &&
                        <div className="timeline-state__central">
                            <div className="timeline-state__player-supply timeline-state__player-supply--player1">
                                <div className="timeline-state__supply-value">
                                    {currentTimelineState[1].supply} / {currentTimelineState[1].supply_cap}
                                </div>
                                <div className="timeline-state__supply-block-value">
                                    {currentTimelineState[1].supply_block}s ({currentTimelineState[1].supply_block / 5})
                                </div>
                            </div>
                            <span className="timeline-state__current-time">
                                {formatCurrentTime(gameloop.current)}
                            </span>
                            <div className="timeline-state__player-supply timeline-state__player-supply--player2">
                                <div className="timeline-state__supply-value">
                                    {currentTimelineState[2].supply} / {currentTimelineState[2].supply_cap}
                                </div>
                                <div className="timeline-state__supply-block-value">
                                    {currentTimelineState[2].supply_block}s ({currentTimelineState[2].supply_block / 5})
                                </div>
                            </div>
                        </div>}
                    {playerOrder.map((playerId, index) => (
                        <div
                            key={`player-${players[playerId].mmr}`}
                            className={`timeline-state__player timeline-state__player--player${index + 1}`}
                        >
                            {index !== Object.values(players).length - 1 ?
                                <Fragment>
                                    <img
                                        src={`../../icons/${players[playerId].race.toLowerCase()}-logo.svg`}
                                        alt={players[playerId].race}
                                        className="timeline-state__race-icon"
                                    />
                                    <span className="timeline-state__player-name">
                                        {players[playerId].name}
                                    </span>
                                    <svg
                                        className="timeline-state__player-indicator"
                                        height="16"
                                        width="16"
                                    >
                                        <circle
                                            cx="8"
                                            cy="8"
                                            r="8"
                                            fill="hsl(0, 100%, 55%)"
                                        />
                                    </svg>
                                </Fragment>
                                :
                                <Fragment>
                                    <svg
                                        className="timeline-state__player-indicator"
                                        height="16"
                                        width="16"
                                    >
                                        <circle
                                            cx="8"
                                            cy="8"
                                            r="8"
                                            fill="hsl(240, 80%, 55%)"
                                        />
                                    </svg>
                                    <span className="timeline-state__player-name" style={{ textAlign: 'right' }}>
                                        {players[playerId].name}
                                    </span>
                                    <img
                                        src={`../../icons/${players[playerId].race.toLowerCase()}-logo.svg`}
                                        alt={players[playerId].race}
                                        className="timeline-state__race-icon"
                                    />
                                </Fragment>}
                        </div>
                    ))}
                </div>
                {currentTimelineState &&
                    <Fragment>
                        <RaceState
                            timelineState={currentTimelineState}
                            players={players}
                            playerOrder={playerOrder}
                        />
                        {/* <CurrentSelectionState
                            timelineState={currentTimelineState}
                            players={players}
                        /> */}
                        <UpgradeState
                            timelineState={currentTimelineState}
                            players={players}
                            playerOrder={playerOrder}
                        />
                        <ObjectState
                            objectType="unit"
                            timelineState={currentTimelineState}
                            players={players}
                            playerOrder={playerOrder}
                            visibleState={visibleState}
                            objectStates={objectStates.unit}
                            ignoreObjects={ignoreObjects.unit}
                        />
                        <ObjectState
                            objectType="building"
                            timelineState={currentTimelineState}
                            players={players}
                            playerOrder={playerOrder}
                            visibleState={visibleState}
                            objectStates={objectStates.building}
                            ignoreObjects={ignoreObjects.building}
                        />
                    </Fragment>}
            </div>
        </div>
    );
};

export default TimelineArea;
