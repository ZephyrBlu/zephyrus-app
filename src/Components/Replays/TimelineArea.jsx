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
    const currentComparisonTimelineState = props.comparisonTimeline ? props.comparisonTimeline[props.gameloop] : null;

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
                    <YAxis />
                    <CartesianGrid horizontal={false} vertical={false} />
                    <Tooltip
                        content={
                            <TimelineTooltip
                                currentTimelineState={currentComparisonTimelineState || currentTimelineState}
                                gameloop={props.gameloop}
                                setGameloop={props.setGameloop}
                                isTimelineFrozen={isTimelineFrozen}
                                players={props.players}
                                comparisonPlayer={props.comparisonPlayer}
                            />
                        }
                        position={{ y: -20 }}
                    />
                    <Line
                        type="monotone"
                        dataKey={`1.${props.timelineStat}`}
                        stroke="red"
                        activeDot={{ stroke: 'red', fill: 'red' }}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey={`2.${props.timelineStat}`}
                        stroke="blue"
                        activeDot={{ stroke: 'blue', fill: 'blue' }}
                        dot={false}
                    />
                    {props.comparisonPlayer && props.comparisonPlayer.id &&
                        <Line
                            type="monotone"
                            dataKey={`comparison.${props.comparisonPlayer.id}.${props.timelineStat}`}
                            stroke="hsl(0, 0%, 85%)"
                            activeDot={{ stroke: 'hsl(0, 0%, 85%)', fill: 'hsl(0, 0%, 85%)' }}
                            dot={false}
                        />}
                </LineChart>
            </ResponsiveContainer>
            {currentTimelineState &&
                <div className="timeline-state">
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
