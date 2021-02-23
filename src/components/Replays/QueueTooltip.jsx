import React, { useEffect, useState } from 'react';

const QueueTooltip = ({ payload }) => {
    const formatCurrentTime = (tickGameloop) => {
        const totalSeconds = Math.floor(tickGameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1
            ? `${minutes}:0${seconds}`
            : `${minutes}:${seconds}`;
    };

    const queueChartTypes = {
        queueState: 'Production Uptime',
        inactiveQueues: 'Inactive Production',
        cumulativeDowntime: 'Production Downtime',
    };

    console.log(payload);
    // switch (payload[0].dataKey) {
    //     case 'queueState':

    //     case 'inactiveQueues':

    //     case 'cumulativeDowntime': 

    //     default:
    //         // nothing
    // }

    let content;
    if (payload.length > 0) {
        content = (
            <div className="tooltip">
                <table>
                    <tbody>
                        <tr>
                            <td className="tooltip__current-time">
                                {formatCurrentTime(payload[0].payload.gameloop)}&nbsp;
                            </td>
                            <td className="tooltip__player">
                                {queueChartTypes[payload[0].dataKey] || 'Production Uptime'}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Inactive Buildings:
                            </td>
                            <td>
                                {payload[0].payload.inactiveQueues}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Current Downtime:
                            </td>
                            <td>
                                {Math.round(payload[0].payload.downtime.current / 22.4)}s (~{Math.round(payload[0].payload.downtime.current / 22.4 / 12)} Workers)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total Downtime:
                            </td>
                            <td>
                                {Math.round(payload[0].payload.cumulativeDowntime / 22.4)}s (~{Math.round(payload[0].payload.cumulativeDowntime / 22.4 / 12)} Workers)
                            </td>
                        </tr>    
                            
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

export default QueueTooltip;
