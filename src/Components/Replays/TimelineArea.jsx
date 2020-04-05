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
import '../General/CSS/Tooltip.css';
import './CSS/TimelineArea.css';

const TimelineArea = (props) => {
    const [isTimelineFrozen, setTimelineState] = useState(false);
    const currentTimelineState = props.timeline[props.gameloop];

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
            <ResponsiveContainer width="100%" height={200}>
                <LineChart
                    data={props.timelineData}
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
                                currentTimelineState={currentTimelineState}
                                gameloop={props.gameloop}
                                setGameloop={props.setGameloop}
                                isTimelineFrozen={isTimelineFrozen}
                                players={props.players}
                            />
                        }
                        position={{ y: -20 }}
                    />
                    <Line
                        type="monotone"
                        dataKey={`1.${props.timelineStat}`}
                        stroke="hsl(0, 100%, 55%)"
                        activeDot={{ stroke: 'hsl(0, 100%, 55%)', fill: 'hsl(0, 100%, 55%)' }}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey={`2.${props.timelineStat}`}
                        stroke="hsl(240, 80%, 55%)"
                        activeDot={{ stroke: 'hsl(240, 80%, 55%)', fill: 'hsl(240, 80%, 55%)' }}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
            {currentTimelineState &&
                <div className="timeline-state">
                    <div className="timeline-state__players">
                        {Object.values(props.players).map((player, index) => (
                            <div
                                key={`player-${player.mmr}`}
                                className={`timeline-state__player timeline-state__player--player-${index + 1}`}
                            >
                                {index !== Object.values(props.players).length - 1 ?
                                    <Fragment>
                                        <img
                                            src={`../../icons/${player.race}-logo.svg`}
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
                                            src={`../../icons/${player.race}-logo.svg`}
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
                        players={props.players}
                    />
                    <UpgradeState
                        timelineState={currentTimelineState}
                        players={props.players}
                    />
                    <ObjectState
                        objectType="unit"
                        timelineState={currentTimelineState}
                        players={props.players}
                        visibleState={props.visibleState}
                        objectStates={objectStates.unit}
                        ignoreObjects={ignoreObjects.unit}
                    />
                    <ObjectState
                        objectType="building"
                        timelineState={currentTimelineState}
                        players={props.players}
                        visibleState={props.visibleState}
                        objectStates={objectStates.building}
                        ignoreObjects={ignoreObjects.building}
                    />
                </div>}
        </Fragment>
    );
};

export default TimelineArea;
