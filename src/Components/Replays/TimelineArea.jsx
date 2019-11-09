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
import UnitState from './UnitState';
import BuildingState from './BuildingState';
import CurrentSelectionState from './CurrentSelectionState';

const TimelineArea = (props) => {
    const [isTimelineFrozen, setTimelineState] = useState(false);
    let timeout;
    let prevGameloop = 0;
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

    return (
        <Fragment>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart
                    data={props.timelineData}
                    margin={{ right: 25 }}
                    onClick={
                        () => (
                            isTimelineFrozen ? setTimelineState(false) : setTimelineState(true)
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
                        formatter={(value, name, payload) => {
                            if (isTimelineFrozen) {
                                // pass
                            } else if (payload && payload.payload[1].gameloop !== prevGameloop) {
                                clearTimeout(timeout);
                                timeout = setTimeout(() => {
                                    props.setGameloop(payload.payload[1].gameloop);
                                }, 10);
                                prevGameloop = payload.payload[1].gameloop;
                            }
                        }}
                        isAnimationActive={false}
                        wrapperStyle={{ visibility: 'hidden' }}
                    />
                    <Line
                        type="monotone"
                        dataKey={`1.${props.timelineStat}`}
                        stroke="red"
                        activeDot={false}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey={`2.${props.timelineStat}`}
                        stroke="blue"
                        activeDot={false}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
            {currentTimelineState &&
                <div className="timeline-state">
                    <CurrentSelectionState
                        timelineState={currentTimelineState}
                        players={props.players}
                    />
                    <UnitState
                        timelineState={currentTimelineState}
                        players={props.players}
                    />
                    <BuildingState
                        timelineState={currentTimelineState}
                        players={props.players}
                    />
                </div>}
        </Fragment>
    );
};

export default TimelineArea;
