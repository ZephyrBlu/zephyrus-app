import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    Bar,
} from 'recharts';
import QueueTooltip from './QueueTooltip';
import './CSS/QueueChart.css';

const QueueChart = ({ replay }) => {
    const [selectedChart, setSelectedChart] = useState('queueState');
    const [playerQueues, setPlayerQueues] = useState(null);
    const [maxProductionQueues, setMaxProductionQueues] = useState(null);
    const [userRace] = useState(replay.data.players[replay.data.user_match_id].race);

    useEffect(() => {
        const fetchQueueData = async () => {
            const data = await fetch('../../local_queues.json').then(res => res.json());
            const playerData = data[replay.data.user_match_id].map((queueState) => {
                if (queueState.queues.length > maxProductionQueues) {
                    setMaxProductionQueues(queueState.queues.length);
                }

                let inactiveQueues = 0;
                // count truthy values
                queueState.queues.forEach((queue, index) => {
                    if (!queue) {
                        inactiveQueues += 1;
                    } else {
                        // creating series entry for queue
                        queueState[`queue${index}`] = -2 * index;
                    }
                });
                queueState.inactiveQueues = inactiveQueues;
                queueState.cumulativeDowntime = queueState.downtime.total;
                return queueState;
            });
            setPlayerQueues(playerData);
        };
        fetchQueueData();
    }, []);

    console.log(replay);
    console.log(playerQueues);

    const queueChartTypes = {
        queueState: `${userRace.current !== 'Zerg' ? 'Worker' : 'Larva'} Production Uptime`,
        inactiveQueues: `Inactive ${userRace.current !== 'Zerg' ? 'Worker' : 'Larva'} Production Buildings`,
        cumulativeDowntime: `Cumulative ${userRace.current !== 'Zerg' ? 'Worker' : 'Larva'} Production Downtime`,
    };

    return (
        <div className="QueueChart">
            <ResponsiveContainer className="QueueChart__chart" width="99%" height="99%">
                <ComposedChart data={playerQueues} barCategoryGap={-0.5}>
                    <XAxis dataKey="gameloop" hide />
                    <YAxis
                        type="number"
                        domain={
                            selectedChart !== 'queueState'
                                ? ['auto', 'auto']
                                : ['dataMin - 2', 'dataMax + 2']
                        }
                        hide
                    />
                    <Tooltip
                        content={
                            <QueueTooltip race={userRace} />
                        }
                        position={{ y: -10 }}
                    />
                    {selectedChart !== 'queueState' ? (
                        <Line
                            type="monotone"
                            dataKey={selectedChart}
                            stroke="hsl(210, 68%, 47%)"
                            strokeWidth={2}
                            activeDot={{ stroke: 'hsl(210, 68%, 47%)', fill: 'hsl(210, 68%, 47%)' }}
                            dot={false}
                        />
                    ) : new Array(maxProductionQueues).fill(0).map((_, index) => (
                        <Line
                            key={`queue${index}`}
                            type="monotone"
                            dataKey={`queue${index}`}
                            stroke="hsl(210, 68%, 47%)"
                            strokeWidth={15}
                            activeDot={{ stroke: 'hsl(210, 68%, 47%)', fill: 'hsl(210, 68%, 47%)' }}
                            dot={false}
                        />
                    ))}
                    <Bar
                        background={({ x, y, className, width, height, key, supply_blocked }) => (
                            supply_blocked
                                ? (
                                    <path
                                        name={key}
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill="white"
                                        className={className}
                                        radius="0"
                                        d={`M ${x},${y} h ${width} v ${height} h -${width} Z`}
                                    />
                                )
                                : false
                        )}
                    />
                </ComposedChart>
            </ResponsiveContainer>
            <div className="QueueChart__chart-selector">
                {Object.entries(queueChartTypes).map(([chartKey, chartName]) => (
                    <button
                        key={chartKey}
                        className={`QueueChart__chart-type ${selectedChart === chartKey ? 'QueueChart__chart-type--active' : ''}`}
                        onClick={() => {
                            setSelectedChart(chartKey);
                            localStorage.queueChart = chartKey;
                        }}
                    >
                        {chartName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QueueChart;
