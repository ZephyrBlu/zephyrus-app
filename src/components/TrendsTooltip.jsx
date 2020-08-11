import { useEffect, useState } from 'react';

const TrendsTooltip = ({ payload, trends }) => {
    const [currentTimeout, setCurrentTimeout] = useState(false);
    const [currentGameloop, setCurrentGameloop] = useState(0);
    const [prevGameloop, setPrevGameloop] = useState(0);

    console.log(payload);

    useEffect(() => {
        setTimeout(async () => {
            if (payload.length > 0) {
                setPrevGameloop(currentGameloop);
                setCurrentGameloop(payload[0].payload.gameloop);
            }
            setCurrentTimeout(false);
        }, 100);
    }, [currentTimeout]);

    const selectedStat = {
        workers_active: 'Workers Active',
        workers_lost: 'Workers Lost',
        workers_killed: 'Workers Killed',
        total_collection_rate: 'Collection Rate',
        total_army_value: 'Army Value',
        total_unspent_resources: 'Time-to-Mine',
        supply_block: 'Supply Block',
    };

    const selectedMatchup = {
        all: 'All',
        protoss: 'Protoss',
        zerg: 'Zerg',
        terran: 'Terran',
    };

    const selectedMatchType = {
        all: 'All',
        win_loss: 'Win/Loss',
    };

    const formatCurrentTime = (tickGameloop) => {
        const totalSeconds = Math.floor(tickGameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1
            ? `${minutes}:0${seconds}`
            : `${minutes}:${seconds}`;
    };

    if (payload.length > 0) {
        const newGameloop = payload[0].payload.gameloop;
        if (!currentTimeout && newGameloop !== prevGameloop) {
            setCurrentTimeout(true);
        }
    }

    let content;

    if (payload.length > 0) {
        const stat = payload[0].payload[payload[0].name.split('.')[0]];
        const statMedian = stat.median;
        const statQuartiles = stat.quartile_range;
        const statMinMax = stat.total_range;

        content = (
            <div className="tooltip__timeline-stat">
                <div className="tooltip__stat-header">
                    <h1 className="tooltip__time">
                        {formatCurrentTime(payload[0].payload.gameloop)}
                    </h1>
                    <h2 className="tooltip__stat-name">
                        {selectedStat[trends.stat]}
                    </h2>
                    <h3 className="tooltip__matchup">
                        {selectedMatchup[trends.matchup]}
                    </h3>
                    <h3 className="tooltip__stat-type">
                        {selectedMatchType[trends.type]}
                    </h3>
                </div>
                <div className="tooltip__stat-values">
                    <div className="tooltip__stat-median">
                        {statMedian}
                    </div>
                    <div className="tooltip__stat-quartiles">
                        {statQuartiles}
                    </div>
                    <div className="tooltip__stat-min-max">
                        {statMinMax}
                    </div>
                </div>
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

export default TrendsTooltip;
