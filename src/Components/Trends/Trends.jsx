import { useSelector } from 'react-redux';
import { useState, Fragment } from 'react';
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
import { useLoadingState } from '../../hooks';
import LoadingAnimation from '../shared/LoadingAnimation';
import './CSS/Trends.css';
import DefaultResponse from '../shared/DefaultResponse';

const Trends = () => {
    const currentTrends = useSelector(state => state.raceData[state.selectedRace].trends);
    const [trendsMatchup] = useState('all');

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
    const initialTrendTypes = {};
    generalStats.forEach((stat) => {
        initialTrendTypes[stat] = 'all';
    });
    const [trendTypes, setTrendTypes] = useState(initialTrendTypes);

    const checkTrends = (trends) => {
        let currentSeasonTrends = null;
        let previousSeasonTrends = null;

        if (!trends) {
            return { currentSeasonTrends, previousSeasonTrends };
        }

        if (trends[trendsMatchup].seasons.current) {
            currentSeasonTrends = trends[trendsMatchup].seasons.current;
        }

        if (trends[trendsMatchup].seasons.previous) {
            previousSeasonTrends = trends[trendsMatchup].seasons.previous;
        }

        return { currentSeasonTrends, previousSeasonTrends };
    };
    const { currentSeasonTrends, previousSeasonTrends } = checkTrends(currentTrends);

    const statNames = {
        winrate: 'Winrate',
        mmr: 'MMR',
        sq: 'Spending Quotient',
        apm: 'APM',
        spm: 'Screens Per Minute',
        supply_block: 'Supply Block',
        workers_produced: 'Workers Produced',
        workers_killed: 'Workers Killed',
        workers_lost: 'Workers Lost',
    };

    const dataStates = {
        trends: {
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({ _currentSeasonTrends, _previousSeasonTrends, _trendTypes, _setTrendTypes }) => {
                const selectTrends = () => (
                    _currentSeasonTrends || _previousSeasonTrends
                );

                const calcStatDiff = (stat) => {
                    const currentStat = _currentSeasonTrends[stat].avg;
                    const previousStat = _previousSeasonTrends[stat].avg;

                    const seasonDiff = currentStat - previousStat;
                    return `${seasonDiff >= 0 ? '+' : ''}${stat === 'mmr' ? seasonDiff : `${Number(((seasonDiff / previousStat) * 100).toFixed(1))}%`}`;
                };

                return (
                    <Fragment>
                        <span className="Trends__title-stat">
                            <span className="Trends__title-text">
                                {_currentSeasonTrends ? 'Currently at' : 'Finished at'}
                            </span>
                            <div className="Trends__title-value">
                                {selectTrends().mmr.end}
                            </div>
                            <span className="Trends__title-text">
                                MMR
                                {` (${selectTrends().mmr.values.slice(-1)[0].value - selectTrends().mmr.values[0].value >= 0 ? '+' : ''}${selectTrends().mmr.values.slice(-1)[0].value - selectTrends().mmr.values[0].value} this season)`}
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
                                        <div className="Trends__season-stat-data">
                                            <h2 className="Trends__season-stat-name">{statNames[stat]}</h2>
                                            <p className="Trends__season-stat-value">
                                                {selectTrends()[stat].avg}
                                                {_currentSeasonTrends && _previousSeasonTrends && ` (${calcStatDiff(stat)})`}
                                            </p>
                                        </div>
                                        {stat !== 'mmr' &&
                                            <div className="Trends__season-stat-type-wrapper">
                                                <button
                                                    className={`
                                                        Trends__season-stat-type 
                                                        Trends__season-stat-type--all
                                                        ${_trendTypes[stat] === 'all' ? 'Trends__season-stat-type--active' : ''}
                                                    `}
                                                    onClick={() => _setTrendTypes(prevState => ({
                                                        ...prevState,
                                                        [stat]: 'all',
                                                    }))}
                                                >
                                                    All
                                                </button>
                                                <button
                                                    className={`
                                                        Trends__season-stat-type 
                                                        Trends__season-stat-type--win-loss
                                                        ${_trendTypes[stat] === 'win_loss' ? 'Trends__season-stat-type--active' : ''}
                                                    `}
                                                    onClick={() => _setTrendTypes(prevState => ({
                                                        ...prevState,
                                                        [stat]: 'win_loss',
                                                    }))}
                                                >
                                                    W/L
                                                </button>
                                            </div>}
                                    </div>
                                    <ResponsiveContainer width="99%" height={125}>
                                        {stat === 'mmr' ?
                                            <LineChart
                                                data={selectTrends()[stat].values}
                                                className="Trends__season-stat-chart"
                                                margin={{ left: -15, right: 2, top: 10, bottom: 10 }}
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
                                                data={selectTrends()[stat].values[_trendTypes[stat]]}
                                                className="Trends__season-stat-chart"
                                                margin={{ bottom: -10 }}
                                            >
                                                <XAxis dataKey="bin" />
                                                {_trendTypes[stat] === 'all' &&
                                                    <Bar
                                                        type="monotone"
                                                        dataKey="value"
                                                        fill="hsl(210, 68%, 47%)"
                                                        radius={[8, 8, 0, 0]}
                                                    />}
                                                {_trendTypes[stat] === 'win_loss' &&
                                                    <Bar
                                                        type="monotone"
                                                        dataKey="win"
                                                        stackId="wl"
                                                        fill="hsla(120, 80%, 25%, 0.9)"
                                                    />}
                                                {_trendTypes[stat] === 'win_loss' &&
                                                    <Bar
                                                        type="monotone"
                                                        dataKey="loss"
                                                        stackId="wl"
                                                        fill="hsla(0, 70%, 25%, 0.9)"
                                                        radius={[8, 8, 0, 0]}
                                                    />}
                                            </BarChart>}
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                );
            },
            ERROR: (<DefaultResponse content="We couldn't find any replays" />),
        },
    };

    const checkTrendsLoadingState = () => {
        if (currentTrends) {
            return 'SUCCESS';
        } else if (currentTrends === false) {
            return 'ERROR';
        }
        return 'IN_PROGRESS';
    };

    const trendsLoadingData = {
        data: {
            _currentSeasonTrends: currentSeasonTrends,
            _previousSeasonTrends: previousSeasonTrends,
            _trendTypes: trendTypes,
            _setTrendTypes: setTrendTypes,
        },
        loadingState: checkTrendsLoadingState(),
    };
    const TrendsState = useLoadingState(trendsLoadingData, dataStates.trends);

    return (
        <div className="Trends">
            <div className="Trends__season">
                <h1 className="Trends__title">
                    Season Stats{!currentSeasonTrends && previousSeasonTrends && ' (Previous)'}
                </h1>
                <TrendsState />
            </div>
        </div>
    );
};

export default Trends;
