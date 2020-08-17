import { useEffect, useState, Fragment } from 'react';
import './CSS/TrendsTooltip.css';

const TrendsTooltip = ({ payload, trends }) => {
    const [currentTimeout, setCurrentTimeout] = useState(false);
    const [currentGameloop, setCurrentGameloop] = useState(0);
    const [prevGameloop, setPrevGameloop] = useState(0);

    useEffect(() => {
        setTimeout(async () => {
            if (payload && payload.length > 0) {
                setPrevGameloop(currentGameloop);
                setCurrentGameloop(payload[0].payload.gameloop);
            }
            setCurrentTimeout(false);
        }, 100);
    }, [currentTimeout]);

    const selectedStat = {
        workers_active: 'Workers Active',
        total_collection_rate: 'Collection Rate',
        total_army_value: 'Army Value',
        workers_lost: 'Workers Lost',
        workers_killed: 'Workers Killed',
        total_resources_lost: 'Resources Lost',
        total_unspent_resources: 'Unspent Resources',
    };

    const selectedMatchLength = {
        early: 'Early-game',
        mid: 'Mid-game',
        late: 'Late-game',
    };

    const formatCurrentTime = (tickGameloop) => {
        const totalSeconds = Math.floor(tickGameloop / 22.4);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds - (minutes * 60);
        return String(seconds).length === 1
            ? `${minutes}:0${seconds}`
            : `${minutes}:${seconds}`;
    };

    if (payload && payload.length > 0) {
        const newGameloop = payload[0].payload.gameloop;
        if (!currentTimeout && newGameloop !== prevGameloop) {
            setCurrentTimeout(true);
        }
    }

    let content;

    if (payload && payload.length > 0) {
        const stat = payload[0].payload.all;
        const winStat = payload[0].payload.win;
        const lossStat = payload[0].payload.loss;

        content = (
            <div className="TrendsTooltip__timeline-stat">
                <div className="TrendsTooltip__stat-header">
                    <h1 className="TrendsTooltip__time">
                        {formatCurrentTime(payload[0].payload.gameloop)}
                    </h1>
                    <h2 className="TrendsTooltip__stat-name">
                        {selectedStat[trends.stat]}
                    </h2>
                    {!trends.matchup.includes('A') &&
                        <h3 className="TrendsTooltip__matchup">
                            {trends.matchup}
                        </h3>}
                    {trends.stage !== 'all' &&
                        <h3 className="TrendsTooltip__stat-stage">
                            {selectedMatchLength[trends.stage]}
                        </h3>}
                    <h3 className="TrendsTooltip__match-count">
                        {payload[0].payload.count} games
                    </h3>
                </div>
                {trends.type === 'all' ?
                    <div className="TrendsTooltip__stat-values">
                        <div className="TrendsTooltip__stat-median">
                            Median of {stat.median} {selectedStat[trends.stat]} &#64;{formatCurrentTime(payload[0].payload.gameloop)}
                        </div>
                        <div className="TrendsTooltip__stat-quartiles">
                            25<sup>th</sup> to 50<sup>th</sup> Percentile Range of {stat.quartile_range[0]} to {stat.quartile_range[1]}
                        </div>
                        <div className="TrendsTooltip__stat-min-max">
                            5<sup>th</sup> to 95<sup>th</sup> Percentile Range of {stat.total_range[0]} to {stat.total_range[1]}
                        </div>
                    </div>
                    :
                    <Fragment>
                        <div className="TrendsTooltip__stat-values TrendsTooltip__stat-values--win">
                            <h1 className="TrendsTooltip__stat-type">Win</h1>
                            <div className="TrendsTooltip__stat-median">
                                Median of {winStat.median} {selectedStat[trends.stat]} &#64;{formatCurrentTime(payload[0].payload.gameloop)}
                            </div>
                            <div className="TrendsTooltip__stat-quartiles">
                                25<sup>th</sup> to 50<sup>th</sup> Percentile Range of {winStat.quartile_range[0]} to {winStat.quartile_range[1]}
                            </div>
                            {/* <div className="TrendsTooltip__stat-min-max">
                                5<sup>th</sup> to 95<sup>th</sup> Percentile Range of {winStat.total_range[0]} to {winStat.total_range[1]}
                            </div> */}
                        </div>
                        <div className="TrendsTooltip__stat-values">
                            <h1 className="TrendsTooltip__stat-type">Loss</h1>
                            <div className="TrendsTooltip__stat-median">
                                Median of {lossStat.median} {selectedStat[trends.stat]} &#64;{formatCurrentTime(payload[0].payload.gameloop)}
                            </div>
                            <div className="TrendsTooltip__stat-quartiles">
                                25<sup>th</sup> to 50<sup>th</sup> Percentile Range of {lossStat.quartile_range[0]} to {lossStat.quartile_range[1]}
                            </div>
                            {/* <div className="TrendsTooltip__stat-min-max">
                                5<sup>th</sup> to 95<sup>th</sup> Percentile Range of {lossStat.total_range[0]} to {lossStat.total_range[1]}
                            </div> */}
                        </div>
                    </Fragment>}
            </div>
        );
    } else {
        content = null;
    }

    return (
        <div id="tooltip" className="TrendsTooltip">
            {content}
        </div>
    );
};

export default TrendsTooltip;
