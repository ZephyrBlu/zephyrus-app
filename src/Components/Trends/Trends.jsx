import { useSelector } from 'react-redux';
import { Fragment } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    XAxis,
    YAxis,
    Line,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';
import './CSS/Trends.css';

const Trends = () => {
    const currentTrends = useSelector(state => state.raceData[state.selectedRace].trends);

    const checkTrends = (trends) => {
        let currentSeasonTrends = null;
        let previousSeasonTrends = null;

        if (!trends) {
            return { currentSeasonTrends, previousSeasonTrends };
        }

        console.log(trends);

        if (trends.seasons.current) {
            currentSeasonTrends = trends.seasons.current;
        }

        if (trends.seasons.previous) {
            previousSeasonTrends = trends.seasons.previous;
        }

        return { currentSeasonTrends, previousSeasonTrends };
    };
    const { currentSeasonTrends, previousSeasonTrends } = checkTrends(currentTrends);

    const statNames = {
        winrate: 'Winrate',
        mmr: 'MMR',
        sq: 'Spending Quotient',
        apm: 'APM',
        spm: 'SPM',
        supply_block: 'Supply Block',
        workers_produced: 'Workers Produced',
        workers_killed: 'Workers Killed',
        workers_lost: 'Workers Lost',
    };

    const generalStats = [
        'mmr',
        'apm',
        'spm',
        'sq',
        'supply_block',
        'workers_produced',
        'workers_killed',
        'workers_lost',
    ];

    console.log(currentTrends);

    const selectTrends = () => (
        currentSeasonTrends || previousSeasonTrends
    );

    const calcStatDiff = (stat) => {
        const currentStat = currentSeasonTrends[stat].avg;
        const previousStat = previousSeasonTrends[stat].avg;

        const seasonDiff = currentStat - previousStat;
        return Number((seasonDiff / previousStat).toFixed(1));
    };

    console.log(currentTrends);

    return (
        <div className="Trends">
            <div className="Trends__season">
                <h1 className="Trends__title">
                    Season Stats{!currentSeasonTrends && previousSeasonTrends && ' (Previous)'}
                </h1>
                {currentTrends &&
                    <Fragment>
                        <span className="Trends__title-stat">
                            <span className="Trends__title-text">
                                Finished the season at
                            </span>
                            <div className="Trends__title-value">
                                {selectTrends().mmr.end}
                            </div>
                            <span className="Trends__title-text">
                                MMR
                                {currentSeasonTrends && previousSeasonTrends &&
                                    ` (${currentSeasonTrends.mmr.values[0].value - currentSeasonTrends.mmr.values[0].value >= 0 && '+'}${currentSeasonTrends.mmr.values[0].value - currentSeasonTrends.mmr.values[0].value})`}
                                &nbsp;with a
                            </span>
                            <div className="Trends__title-value">
                                {selectTrends().winrate}%
                            </div>
                            <span className="Trends__title-text">
                                winrate over&nbsp;
                                {selectTrends().count} games
                            </span>
                        </span>
                        <div className="Trends__season-stats">
                            {generalStats.map(stat => (
                                <div className={`Trends__season-stat-wrapper Trends__season-stat-wrapper--${stat}`}>
                                    <div className="Trends__season-stat">
                                        <h2 className="Trends__season-stat-name">{statNames[stat]}</h2>
                                        <p className="Trends__season-stat-value">{selectTrends()[stat].avg}</p>
                                        {currentSeasonTrends && previousSeasonTrends && `(${calcStatDiff(stat)})`}
                                    </div>
                                    <ResponsiveContainer width="100%" height={150}>
                                        {stat === 'mmr' ?
                                            <LineChart
                                                data={selectTrends()[stat].values}
                                                className="Trends__season-stat-chart"
                                                margin={{ left: -15, right: 2, top: 10, bottom: -10 }}
                                            >
                                                <YAxis type="number" domain={['auto', 'auto']} interval={0} />
                                                <ReferenceLine y={selectTrends()[stat].values[0].value} stroke="hsl(0, 0%, 47%)" strokeWidth={0.5} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="hsl(210, 68%, 47%)"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                            :
                                            <BarChart
                                                data={selectTrends()[stat].values}
                                                className="Trends__season-stat-chart"
                                                margin={{ bottom: -10 }}
                                            >
                                                <XAxis dataKey="bin" />
                                                <Bar
                                                    type="monotone"
                                                    dataKey="value"
                                                    fill="hsl(210, 68%, 47%)"
                                                />
                                            </BarChart>}
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </Fragment>}
            </div>
        </div>
    );
};

export default Trends;
