import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    Tooltip,
    Line,
} from 'recharts';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import RaceState from './RaceState';
import ObjectState from './ObjectState';
// import CurrentSelectionState from './CurrentSelectionState';
import UpgradeState from './UpgradeState';
import TimelineTooltip from './TimelineTooltip';
import './CSS/ReplayTimeline.css';

const ReplayTimeline = ({ replay, timeline, players }) => {
    const visibleState = useSelector(state => state.visibleState);
    const [currentGameloop, setCurrentGameloop] = useState(0);
    const [timelineStat, setTimelineStat] = useState(localStorage.timelineStat);
    const [isTimelineFrozen, setTimelineState] = useState(false);
    const [playerOrder, setPlayerOrder] = useState(null);
    const currentTimelineState = timeline.cached[currentGameloop];

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
        total_army_value: ['Army Value', 'army_value'],
        total_resources_lost: ['Resources Lost', 'resources_lost'],
        total_resouces_collected: ['Resources Collected', 'resources_collected'],
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
        <div className="ReplayTimeline">
            <div className="ReplayTimeline__chart-area">
                <ResponsiveContainer className="ReplayTimeline__timeline" width="99%" height="99%">
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
                                        stat: timelineStat,
                                        state: currentTimelineState,
                                        frozen: isTimelineFrozen,
                                    }}
                                    gameloop={{
                                        current: currentGameloop,
                                        set: setCurrentGameloop,
                                    }}
                                    players={players}
                                    playerOrder={playerOrder}
                                />
                            }
                            position={{ y: -10 }}
                        />
                        <Line
                            type="monotone"
                            dataKey={`${playerOrder[0]}.${timelineStat}`}
                            stroke="hsl(0, 100%, 55%)"
                            activeDot={{ stroke: 'hsl(0, 100%, 55%)', fill: 'hsl(0, 100%, 55%)' }}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey={`${playerOrder[1]}.${timelineStat}`}
                            stroke="hsl(240, 80%, 55%)"
                            activeDot={{ stroke: 'hsl(240, 80%, 55%)', fill: 'hsl(240, 80%, 55%)' }}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="ReplayTimeline__chart-selector">
                    {Object.entries(timelineStatCategories).map(([statKey, statNames]) => (
                        <button
                            key={statKey}
                            className={`ReplayTimeline__chart-stat ${timelineStat === statKey ? 'ReplayTimeline__chart-stat--active' : ''}`}
                            onClick={() => {
                                setTimelineStat(statKey);
                                localStorage.timelineStat = statKey;
                            }}
                        >
                            {statNames[0]}
                        </button>
                    ))}
                </div>
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
                                {formatCurrentTime(currentGameloop)}
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

export default ReplayTimeline;
