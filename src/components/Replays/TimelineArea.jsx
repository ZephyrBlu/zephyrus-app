import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    ReferenceLine,
} from 'recharts';
import React, { Fragment, useState } from 'react';
import RaceState from './RaceState';
import ObjectState from './ObjectState';
// import CurrentSelectionState from './CurrentSelectionState';
import UpgradeState from './UpgradeState';
import TimelineTooltip from './TimelineTooltip';
import './CSS/TimelineArea.css';

const TimelineArea = ({ metrics, timeline, gameloop, players, visibleState }) => {
    const [isTimelineFrozen, setTimelineState] = useState(false);
    const currentTimelineState = timeline.cached[gameloop.current];
    const currentComparisonTimelineState = timeline.comparison.cached
        ? timeline.comparison.cached[gameloop.current]?.comparison
        : null;

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
        <div className="TimelineArea">
            <div className="TimelineArea__chart-area">
                <ResponsiveContainer className="TimelineArea__timeline" width="99%" height={100}>
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
                                    comparisonPlayer={timeline.comparison.player}
                                />
                            }
                            position={{ y: -10 }}
                        />
                        <Line
                            type="monotone"
                            dataKey={`1.${timeline.stat}`}
                            stroke="hsl(0, 100%, 55%)"
                            activeDot={{ stroke: 'hsl(0, 100%, 55%)', fill: 'hsl(0, 100%, 55%)' }}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey={`2.${timeline.stat}`}
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
                {metrics &&
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
                                {/* <p className="TimelineArea__metric-value">
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
                                </p> */}
                            </div>
                        );
                    })}
            </div>
            {currentTimelineState &&
                <div className="timeline-state">
                    <div className="timeline-state__players">
                        <div className="timeline-state__central">
                            <div className="timeline-state__player-supply timeline-state__player-supply--player1">
                                <div className="timeline-state__supply-value">
                                    {currentTimelineState[1].supply} / {currentTimelineState[1].supply_cap}
                                </div>
                                <div className="timeline-state__supply-block-value">
                                    {currentTimelineState[1].supply_block}s
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
                                    {currentTimelineState[2].supply_block}s
                                </div>
                            </div>
                        </div>
                        {Object.values(players).map((player, index) => (
                            <div
                                key={`player-${player.mmr}`}
                                className={`timeline-state__player timeline-state__player--player${index + 1}`}
                            >
                                {index !== Object.values(players).length - 1 ?
                                    <Fragment>
                                        <img
                                            src={`../../icons/${player.race.toLowerCase()}-logo.svg`}
                                            alt={player.race}
                                            className="timeline-state__race-icon"
                                        />
                                        <div className="timeline-state__player-info">
                                            <span className="timeline-state__player-name">
                                                {player.name}
                                            </span>
                                            <span className="timeline-state__player-mmr">
                                                Player {index + 1}&nbsp;&nbsp;{player.mmr}
                                            </span>
                                        </div>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <div className="timeline-state__player-info" style={{ textAlign: 'right' }}>
                                            <span className="timeline-state__player-name">
                                                {player.name}
                                            </span>
                                            <span className="timeline-state__player-mmr">
                                                Player {index + 1}&nbsp;&nbsp;{player.mmr}
                                            </span>
                                        </div>
                                        <img
                                            src={`../../icons/${player.race.toLowerCase()}-logo.svg`}
                                            alt={player.race}
                                            className="timeline-state__race-icon"
                                        />
                                    </Fragment>}
                            </div>
                        ))}
                    </div>
                    <RaceState
                        timelineState={currentTimelineState}
                        players={players}
                    />
                    {/* <CurrentSelectionState
                        timelineState={currentTimelineState}
                        players={players}
                    /> */}
                    <UpgradeState
                        timelineState={currentTimelineState}
                        players={players}
                    />
                    <ObjectState
                        objectType="unit"
                        timelineState={currentTimelineState}
                        players={players}
                        visibleState={visibleState}
                        objectStates={objectStates.unit}
                        ignoreObjects={ignoreObjects.unit}
                    />
                    <ObjectState
                        objectType="building"
                        timelineState={currentTimelineState}
                        players={players}
                        visibleState={visibleState}
                        objectStates={objectStates.building}
                        ignoreObjects={ignoreObjects.building}
                    />
                </div>}
        </div>
    );
};

export default TimelineArea;
