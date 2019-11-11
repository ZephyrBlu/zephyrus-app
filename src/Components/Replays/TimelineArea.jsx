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
import UpgradeState from './UpgradeState';
import '../General/CSS/Tooltip.css';
import './CSS/TimelineArea.css';

const TimelineArea = (props) => {
    const [isTimelineFrozen, setTimelineState] = useState(false);
    const currentTimelineState = props.timeline[props.gameloop];
    let timeout;
    let prevGameloop = 0;

    const timelineStatCategories = {
        'Workers Active': ['workers_active'],
        'Workers Lost': ['workers_killed'],
        'Collection Rate': ['resource_collection_rate.minerals', 'resource_collection_rate.gas'],
        'Army Value': ['army_value.minerals', 'army_value.gas'],
        'Resources Lost': ['resources_lost.minerals', 'resources_lost.gas'],
    };

    const formatTick = (content) => {
        const totalSeconds = Math.floor(Number(content) / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        if (String(seconds).length === 1) {
            return `${minutes}:0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    };

    const formatCurrentTime = (gameloop) => {
        const totalSeconds = Math.floor(gameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1 ?
            `${minutes}:0${seconds}`
            :
            `${minutes}:${seconds}`;
    };

    const string2dot = (obj, str) => (
        str.split('.').reduce((o, i) => o[i], obj)
    );

    const createTooltip = ({ payload }) => {
        if (isTimelineFrozen) {
            // pass
        } else if (payload.length > 0 && payload[0].payload[1].gameloop !== prevGameloop) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                props.setGameloop(payload[0].payload[1].gameloop);
            }, 10);
            prevGameloop = payload[0].payload[1].gameloop;
        }

        let content;

        if (payload.length > 0 && props.players && currentTimelineState) {
            content = (
                <div className="tooltip">
                    <table>
                        <tbody>
                            <tr>
                                <td className="tooltip__current-time">
                                    {formatCurrentTime(props.gameloop)}&nbsp;
                                    <span>{isTimelineFrozen ? '(F)' : ''}</span>
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
                                            fill="red"
                                        />
                                    </svg>
                                    {props.players[1].name}
                                    &nbsp;({props.players[1].race.slice(0, 1)})
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
                                            fill="blue"
                                        />
                                    </svg>
                                    {props.players[2].name}
                                    &nbsp;({props.players[2].race.slice(0, 1)})
                                </td>
                            </tr>
                            {Object.entries(timelineStatCategories).map(([statName, statKeys]) => (
                                <tr key={`${statName}-row`} className="tooltip__timeline-stat">
                                    <td key={`${statName}-name`} className="tooltip__stat-name">
                                        {statName}
                                    </td>
                                    <td key={`${statName}-values-1`} className="tooltip__stat-values">
                                        {statKeys.map((key, index) => (
                                            <span key={`${statName}-${key}-cell-1`} className="tooltip__value tooltip__value--player1">
                                                {string2dot(currentTimelineState[1], key)}&nbsp;
                                                {index === statKeys.length - 1 ? '' : '/ '}
                                            </span>
                                        ))}
                                    </td>
                                    <td key={`${statName}-values-2`} className="tooltip__stat-values">
                                        {statKeys.map((key, index) => (
                                            <span key={`${statName}-${key}-cell-2`} className="tooltip__value tooltip__value--player2">
                                                {string2dot(currentTimelineState[2], key)}&nbsp;
                                                {index === statKeys.length - 1 ? '' : '/ '}
                                            </span>
                                        ))}
                                    </td>
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
                        content={createTooltip}
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
