import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Line,
} from 'recharts';
import { Fragment, useState } from 'react';
import ObjectState from './ObjectState';
import CurrentSelectionState from './CurrentSelectionState';
import UpgradeState from './UpgradeState';
import TimelineTooltip from './TimelineTooltip';
import './CSS/TimelineArea.css';

const TimelineArea = ({ timeline, gameloop, players, visibleState }) => {
    const [isTimelineFrozen, setTimelineState] = useState(false);
    const currentTimelineState = timeline.cached[gameloop.current];

    const formatTick = (content) => {
        const totalSeconds = Math.floor(Number(content) / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        if (String(seconds).length === 1) {
            return `${minutes}:0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    };

    const objectStates = {
        unit: ['live', 'died'],
        building: ['live', 'died', 'in_progress'],
    };

    const ignoreObjects = {
        unit: ['LocustMP', 'BroodlingEscort'],
        building: ['CreepTumor', 'CreepTumorQueen'],
    };

    return (
        <Fragment>
            <ResponsiveContainer width="100%" height={225}>
                <LineChart
                    data={timeline.data}
                    margin={{ right: 25 }}
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
                    />
                    <YAxis padding={{ top: 5 }} />
                    <CartesianGrid horizontal={false} vertical={false} />
                    <Tooltip
                        content={
                            <TimelineTooltip
                                timeline={{
                                    state: currentTimelineState,
                                    frozen: isTimelineFrozen,
                                }}
                                gameloop={gameloop}
                                players={players}
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
                </LineChart>
            </ResponsiveContainer>
            {currentTimelineState &&
                <div className="timeline-state">
                    <div className="timeline-state__players">
                        {Object.values(players).map((player, index) => (
                            <div
                                key={`player-${player.mmr}`}
                                className={`timeline-state__player timeline-state__player--player-${index + 1}`}
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
                                    </Fragment>
                                }
                            </div>
                        ))}
                    </div>
                    <CurrentSelectionState
                        timelineState={currentTimelineState}
                        players={players}
                    />
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
        </Fragment>
    );
};

export default TimelineArea;
