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
import DefaultResponse from '../shared/DefaultResponse';
import InfoTooltip from '../shared/InfoTooltip';
import './CSS/Trends.css';

const Trends = () => {
    const selectedRace = useSelector(state => state.selectedRace);
    const currentTrends = useSelector(state => state.raceData[state.selectedRace].trends);
    const [trendsMatchup, setTrendsMatchup] = useState('all');

    const generalStats = [
        'mmr',
        'match_length',
        'apm',
        'spm',
        'sq',
        'supply_block',
        'workers_killed_lost_diff',
        'workers_produced',
        'workers_killed',
        'workers_lost',
    ];
    const initialTrendTypes = { global: 'all' };
    generalStats.forEach((stat) => {
        initialTrendTypes[stat] = 'all';
    });
    const [trendOptions, setTrendOptions] = useState(initialTrendTypes);

    const checkTrends = (trends) => {
        let currentSeasonTrends = null;
        let previousSeasonTrends = null;
        let mmrTrends = null;

        if (!trends || !trends[trendsMatchup]) {
            return { mmrTrends, currentSeasonTrends, previousSeasonTrends };
        }

        if (trends[trendsMatchup].seasons.previous) {
            previousSeasonTrends = trends[trendsMatchup].seasons.previous;
            mmrTrends = trends.all.seasons.previous;
        }

        if (trends[trendsMatchup].seasons.current) {
            currentSeasonTrends = trends[trendsMatchup].seasons.current;
            mmrTrends = trends.all.seasons.current;
        }

        return { mmrTrends, currentSeasonTrends, previousSeasonTrends };
    };
    const { mmrTrends, currentSeasonTrends, previousSeasonTrends } = checkTrends(currentTrends);

    const statNames = {
        winrate: 'Winrate',
        mmr: 'MMR',
        match_length: 'Match Length',
        sq: 'SQ',
        apm: 'APM',
        spm: 'SPM',
        supply_block: 'Supply Block',
        workers_killed_lost_diff: 'Workers K/L',
        workers_produced: 'Workers Produced',
        workers_killed: 'Workers Killed',
        workers_lost: 'Workers Lost',
    };

    const statDescriptions = {
        mmr: (<p className="Trends__season-stat-description">This shows your median MMR and MMR over the course of the season.<br /><br />The grey line is your starting MMR</p>),
        match_length: (<p className="Trends__season-stat-description">This shows your median Match Length and the distribution of different Match Lengths</p>),
        sq: (<p className="Trends__season-stat-description">Spending Quotient (SQ) measures how well you spend resources.<br /><br />This shows your median SQ and the distribution of your SQ performance</p>),
        apm: (<p className="Trends__season-stat-description">This shows your median APM and the distribution of your APM performance</p>),
        spm: (<p className="Trends__season-stat-description">Screens Per Minute (SPM) measures how often you move your screen during a match.<br /><br />This shows your median SPM and the distribution of your SPM performance</p>),
        supply_block: (<p className="Trends__season-stat-description">This shows your median Supply Block and the distribution of your Supply Block performance</p>),
        workers_killed_lost_diff: (<p className="Trends__season-stat-description">Workers Killed/Lost is the difference between the number of workers you killed and the number of workers you lost in any given game.<br /><br />This shows your median Workers Killed/Lost difference and the distribution of your performance</p>),
        workers_produced: (<p className="Trends__season-stat-description">This shows your median Workers Produced and the distribution of your Workers Produced performance</p>),
        workers_killed: (<p className="Trends__season-stat-description">This shows your median Workers Produced and the distribution of your Workers Killed performance</p>),
        workers_lost: (<p className="Trends__season-stat-description">This shows your median Workers Produced and the distribution of your Workers Lost performance</p>),
    };

    const statControls = {
        type: {
            all: 'All',
            win_loss: 'W/L',
        },
        matchup: {
            all: 'vs All',
            protoss: 'Protoss',
            zerg: 'Zerg',
            terran: 'Terran',
        },
    };

    const dataStates = {
        trends: {
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({
                _mmrTrends,
                _currentSeasonTrends,
                _previousSeasonTrends,
                _trendsMatchup,
                _setTrendsMatchup,
                _trendOptions,
                _setTrendOptions,
                _statControls,
                _selectedRace,
            }) => {
                const selectTrends = (type = false) => (
                    type === 'mmr' ? _mmrTrends : (_currentSeasonTrends || _previousSeasonTrends)
                );

                const calcStatDiff = (stat) => {
                    const currentStat = _currentSeasonTrends[stat].avg;
                    const previousStat = _previousSeasonTrends[stat].avg;

                    const seasonDiff = currentStat - previousStat;
                    return `${seasonDiff >= 0 ? '+' : ''}${stat === 'mmr' ? seasonDiff : `${Number(((seasonDiff / previousStat) * 100).toFixed(1))}%`}`;
                };

                return (
                    <Fragment>
                        {(_currentSeasonTrends || _previousSeasonTrends) &&
                            <div className="Trends__title-stat">
                                <span className="Trends__title-text">
                                    {_currentSeasonTrends ? 'Currently at' : 'Finished at'}
                                </span>
                                <div className="Trends__title-value">
                                    {selectTrends('mmr').mmr.end}
                                </div>
                                <span className="Trends__title-text">
                                    MMR
                                    {` (${selectTrends('mmr').mmr.values.slice(-1)[0].value - selectTrends('mmr').mmr.values[0].value >= 0 ? '+' : ''}${selectTrends('mmr').mmr.values.slice(-1)[0].value - selectTrends('mmr').mmr.values[0].value} this season)`}
                                    &nbsp;with a
                                </span>
                                <div className="Trends__title-value">
                                    {selectTrends().winrate}%
                                </div>
                                <span className="Trends__title-text">
                                    winrate over&nbsp;
                                    {selectTrends().count}
                                </span>
                                {_trendsMatchup !== 'all' &&
                                    <Fragment>
                                        <div className="Trends__title-value">
                                            {`${_selectedRace.charAt(0).toUpperCase()}v${_trendsMatchup.charAt(0).toUpperCase()}`}
                                        </div>
                                    </Fragment>}
                                <span className="Trends__title-text">
                                    {_trendsMatchup === 'all' && ' '}games
                                </span>
                            </div>}
                        <div className="Trends__season-stat-controls Trends__season-stat-controls--global">
                            <span className="Trends__season-stat-options-wrapper">
                                {Object.entries(statControls.type).map(([controlKey, controlText]) => (
                                    <button
                                        className={`
                                            Trends__season-stat-option
                                            Trends__season-stat-option--type
                                            Trends__season-stat-option--${controlKey}
                                            ${_trendOptions.global === controlKey ? 'Trends__season-stat-option--active' : ''}
                                        `}
                                        onClick={() => {
                                            const newOptions = { global: controlKey };
                                            generalStats.forEach((stat) => {
                                                newOptions[stat] = controlKey;
                                            });
                                            _setTrendOptions(newOptions);
                                        }}
                                    >
                                        {controlText}
                                    </button>
                                ))}
                            </span>
                            <span className="Trends__season-stat-options-wrapper">
                                {Object.entries(_statControls.matchup).map(([controlKey, controlText]) => (
                                    <button
                                        className={`
                                            Trends__season-stat-option
                                            Trends__season-stat-option--matchup
                                            Trends__season-stat-option--${controlKey}
                                            ${_trendsMatchup === controlKey ? 'Trends__season-stat-option--active' : ''}
                                        `}
                                        onClick={() => _setTrendsMatchup(controlKey)}
                                    >
                                        {controlText}
                                    </button>
                                ))}
                            </span>
                        </div>
                        {(_currentSeasonTrends || _previousSeasonTrends) &&
                            <div className="Trends__season-stats">
                                {generalStats.map(stat => (
                                    <div className={`Trends__season-stat-wrapper Trends__season-stat-wrapper--${stat}`}>
                                        <div className="Trends__season-stat">
                                            <div className="Trends__season-stat-data">
                                                <h2 className="Trends__season-stat-name">
                                                    {statNames[stat]}
                                                    <InfoTooltip
                                                        content={statDescriptions[stat]}
                                                        style={{ top: 0 }}
                                                    />
                                                </h2>
                                                <p className="Trends__season-stat-value">
                                                    Med: {selectTrends()[stat].avg}
                                                    {_currentSeasonTrends && _previousSeasonTrends && ` (${calcStatDiff(stat)})`}
                                                </p>
                                            </div>
                                            {stat !== 'mmr' &&
                                                <div className="Trends__season-stat-controls">
                                                    {Object.entries(statControls.type).map(([controlKey, controlText]) => (
                                                        <button
                                                            className={`
                                                                Trends__season-stat-option
                                                                Trends__season-stat-option--stat
                                                                Trends__season-stat-option--type
                                                                Trends__season-stat-option--${controlKey}
                                                                ${_trendOptions[stat] === controlKey ? 'Trends__season-stat-option--active' : ''}
                                                            `}
                                                            onClick={() => _setTrendOptions(prevState => ({
                                                                ...prevState,
                                                                [stat]: controlKey,
                                                            }))}
                                                        >
                                                            {controlText}
                                                        </button>
                                                    ))}
                                                </div>}
                                        </div>
                                        <ResponsiveContainer width="99%" height={125}>
                                            {stat === 'mmr' ?
                                                <LineChart
                                                    data={selectTrends('mmr')[stat].values}
                                                    className="Trends__season-stat-chart"
                                                    margin={{ left: -15, right: 2, top: 10, bottom: 10 }}
                                                >
                                                    <YAxis type="number" domain={['auto', 'auto']} interval={0} />
                                                    <ReferenceLine y={selectTrends('mmr')[stat].values[0].value} stroke="hsl(0, 0%, 47%)" strokeWidth={0.5} />
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
                                                    data={selectTrends()[stat].values[_trendOptions[stat]]}
                                                    className="Trends__season-stat-chart"
                                                    margin={{ bottom: -10 }}
                                                >
                                                    <XAxis
                                                        dataKey="bin"
                                                        interval={0}
                                                        style={stat === 'match_length' ? { fontSize: '14px' } : {}}
                                                    />
                                                    {_trendOptions[stat] === 'all' &&
                                                        <Bar
                                                            type="monotone"
                                                            dataKey="value"
                                                            fill="hsl(210, 68%, 47%)"
                                                            radius={[8, 8, 0, 0]}
                                                        />}
                                                    {_trendOptions[stat] === 'win_loss' &&
                                                        <Bar
                                                            type="monotone"
                                                            dataKey="win"
                                                            stackId="wl"
                                                            fill="hsla(120, 80%, 25%, 0.9)"
                                                        />}
                                                    {_trendOptions[stat] === 'win_loss' &&
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
                            </div>}
                        {!(_currentSeasonTrends || _previousSeasonTrends) &&
                            <div className="Trends__season-stats Trends__season-stats--default">
                                No {`${_selectedRace.charAt(0).toUpperCase()}v${_trendsMatchup.charAt(0).toUpperCase()}`} replays found
                            </div>}
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
            _mmrTrends: mmrTrends,
            _currentSeasonTrends: currentSeasonTrends,
            _previousSeasonTrends: previousSeasonTrends,
            _statControls: statControls,
            _trendsMatchup: trendsMatchup,
            _setTrendsMatchup: setTrendsMatchup,
            _trendOptions: trendOptions,
            _setTrendOptions: setTrendOptions,
            _selectedRace: selectedRace,
        },
        loadingState: checkTrendsLoadingState(),
    };
    const TrendsState = useLoadingState(trendsLoadingData, dataStates.trends);

    const seasonStatsDescription = (
        <p className="Trends__season-stat-description">
            Season Stats shows you an overview of your performance in a given season, and compares it to the previous season if there is data available.
            <br />
            <br />
            You can view stats for any matchup and see how your performance differs between Wins and Losses.
            <br />
            <br />
            We discard the top and bottom 5% of values to eliminate outliers. Non-ladder games are automatically filtered out.
        </p>
    );

    return (
        <div className="Trends">
            <div className="Trends__season">
                <h1 className="Trends__title">
                    Season Stats{!currentSeasonTrends && previousSeasonTrends && ' (Previous)'}
                    <InfoTooltip content={seasonStatsDescription} />
                </h1>
                <TrendsState />
            </div>
        </div>
    );
};

export default Trends;
