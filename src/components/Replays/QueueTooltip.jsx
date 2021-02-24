import React from 'react';

const QueueTooltip = ({ payload, race }) => {
    const formatCurrentTime = (tickGameloop) => {
        const totalSeconds = Math.floor(tickGameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1
            ? `${minutes}:0${seconds}`
            : `${minutes}:${seconds}`;
    };

    console.log(payload);

    let content;
    if (payload.length > 0) {
        const currentDowntimeSec = Math.round(payload[0].payload.downtime.current / 22.4);
        const totalDowntimeSec = Math.round(payload[0].payload.cumulativeDowntime / 22.4);
        content = (
            <div className="tooltip">
                <table>
                    <tbody>
                        <tr>
                            <td className="tooltip__current-time">
                                {formatCurrentTime(payload[0].payload.gameloop)}&nbsp;
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
                                {currentDowntimeSec}s
                                (~{Math.round(currentDowntimeSec / 12)}&nbsp;
                                {race !== 'Zerg' ? 'Workers' : 'Larva'})
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total Downtime:
                            </td>
                            <td>
                                {totalDowntimeSec}s
                                (~{Math.round(totalDowntimeSec / 12)}&nbsp;
                                {race !== 'Zerg' ? 'Workers' : 'Larva'})
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
