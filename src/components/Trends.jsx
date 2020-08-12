import { useSelector } from 'react-redux';
import { useState, useEffect, Fragment } from 'react';
import {
    ComposedChart,
    Area,
    YAxis,
    Line,
    ResponsiveContainer,
    XAxis,
    ReferenceLine,
    Tooltip,
} from 'recharts';
import { jStat } from 'jstat';
import { useLoadingState } from '../hooks';
import LoadingAnimation from './shared/LoadingAnimation';
import DefaultResponse from './shared/DefaultResponse';
import InfoTooltip from './shared/InfoTooltip';
import TrendsTooltip from './TrendsTooltip';
import './Trends.css';

const Trends = () => {
    const selectedRace = useSelector(state => state.selectedRace);
    const currentTrends = useSelector(state => state.raceData[state.selectedRace].trends);
    const [selectedTrends, setSelectedTrends] = useState(null);
    const [trendsMatchup, setTrendsMatchup] = useState('all');
    const [selectedStat, setSelectedStat] = useState('workers_active');
    const [selectedMatchType, setSelectedMatchType] = useState('all');
    const [selectedMatchLength, setSelectedMatchLength] = useState('all');

    console.log('RAW TRENDS', currentTrends);
    console.log('SELECTED SIZE', selectedTrends ? selectedTrends.length : 0);
    console.log('SELECTED TRENDS', selectedTrends);

    useEffect(() => {
        const filterTrends = (trends) => {
            const filteredTrends = [];
            Object.entries(trends[selectedStat]).forEach(([gameloop, matchData]) => {
                const filteredValues = matchData.filter(match => (
                    (trendsMatchup === 'all' || trendsMatchup === match.matchup)
                    && (selectedMatchLength === 'all' || selectedMatchLength === match.stage)
                ));

                if (filteredValues.length < 10) {
                    return;
                }

                const rawValues = {
                    all: [],
                    win: [],
                    loss: [],
                };
                filteredValues.forEach((value) => {
                    rawValues.all.push(value.value);
                    if (value.win) {
                        rawValues.win.push(value.value);
                    } else if (!value.win) {
                        rawValues.loss.push(value.value);
                    }
                });

                const gameloopStats = {};
                Object.entries(rawValues).forEach(([outcome, values]) => {
                    let outcomeQuantiles = jStat.quantiles(
                        values,
                        [0.1, 0.25, 0.5, 0.75, 0.9],
                    );

                    outcomeQuantiles = outcomeQuantiles.map(v => Math.round(v));
                    gameloopStats[outcome] = {
                        median: outcomeQuantiles[2],
                        quartile_range: [outcomeQuantiles[1], outcomeQuantiles[3]],
                        total_range: [outcomeQuantiles[0], outcomeQuantiles[4]],
                    };
                });

                filteredTrends.push({
                    gameloop: Number(gameloop),
                    count: filteredValues.length,
                    ...gameloopStats,
                });
            });

            return filteredTrends;
        };
        if (currentTrends) {
            setSelectedTrends(filterTrends(currentTrends));
        }
    }, [currentTrends, trendsMatchup, selectedStat, selectedMatchType, selectedMatchLength]);

    // const statNames = {
    //     winrate: 'Winrate',
    //     mmr: 'MMR',
    //     match_length: 'Match Length',
    //     sq: 'SQ',
    //     apm: 'APM',
    //     spm: 'SPM',
    //     supply_block: 'Supply Block',
    //     workers_killed_lost_diff: 'Workers K/L',
    //     workers_produced: 'Workers Produced',
    //     workers_killed: 'Workers Killed',
    //     workers_lost: 'Workers Lost',
    // };

    // const statDescriptions = {
    //     mmr: (<p className="Trends__season-stat-description">This shows your median MMR and MMR over the course of the season.<br /><br />The grey line is your starting MMR</p>),
    //     match_length: (<p className="Trends__season-stat-description">This shows your median Match Length and the distribution of different Match Lengths</p>),
    //     sq: (<p className="Trends__season-stat-description">Spending Quotient (SQ) measures how well you spend resources.<br /><br />This shows your median SQ and the distribution of your SQ performance</p>),
    //     apm: (<p className="Trends__season-stat-description">This shows your median APM and the distribution of your APM performance</p>),
    //     spm: (<p className="Trends__season-stat-description">Screens Per Minute (SPM) measures how often you move your screen during a match.<br /><br />This shows your median SPM and the distribution of your SPM performance</p>),
    //     supply_block: (<p className="Trends__season-stat-description">This shows your median Supply Block and the distribution of your Supply Block performance</p>),
    //     workers_killed_lost_diff: (<p className="Trends__season-stat-description">Workers Killed/Lost is the difference between the number of workers you killed and the number of workers you lost in any given game.<br /><br />This shows your median Workers Killed/Lost difference and the distribution of your performance</p>),
    //     workers_produced: (<p className="Trends__season-stat-description">This shows your median Workers Produced and the distribution of your Workers Produced performance</p>),
    //     workers_killed: (<p className="Trends__season-stat-description">This shows your median Workers Produced and the distribution of your Workers Killed performance</p>),
    //     workers_lost: (<p className="Trends__season-stat-description">This shows your median Workers Produced and the distribution of your Workers Lost performance</p>),
    // };

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
        length: {
            all: 'All',
            early: '<7min',
            mid: '7-12min',
            late: '>12min',
        },
        stats: {
            workers_active: 'Workers Active',
            workers_killed: 'Workers Killed',
            workers_lost: 'Workers Lost',
            total_army_value: 'Army Value',
            total_resources_lost: 'Resources Lost',
            total_unspent_resources: 'Time-to-Mine',
            supply_block: 'Supply Block',
            total_collection_rate: 'Collection Rate',
        },
    };

    const dataStates = {
        trends: {
            IN_PROGRESS: (<LoadingAnimation />),
            SUCCESS: ({
                _selectedTrends,
                _trendsMatchup,
                _setTrendsMatchup,
                _selectedStat,
                _setSelectedStat,
                _selectedMatchType,
                _setSelectedMatchType,
                _selectedMatchLength,
                _setSelectedMatchLength,
                _statControls,
                _selectedRace,
            }) => (
                <Fragment>
                    <div className="Trends__season-stat-controls Trends__season-stat-controls--global">
                        <span className="Trends__season-stat-options-wrapper">
                            {Object.entries(_statControls.type).map(([controlKey, controlText]) => (
                                <button
                                    className={`
                                        Trends__season-stat-option
                                        Trends__season-stat-option--type
                                        Trends__season-stat-option--${controlKey}
                                        ${_selectedMatchType === controlKey ? 'Trends__season-stat-option--active' : ''}
                                    `}
                                    onClick={() => _setSelectedMatchType(controlKey)}
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
                        <span className="Trends__season-stat-options-wrapper">
                            {Object.entries(_statControls.length).map(([controlKey, controlText]) => (
                                <button
                                    className={`
                                        Trends__season-stat-option
                                        Trends__season-stat-option--length
                                        Trends__season-stat-option--${controlKey}
                                        ${_selectedMatchLength === controlKey ? 'Trends__season-stat-option--active' : ''}
                                    `}
                                    onClick={() => _setSelectedMatchLength(controlKey)}
                                >
                                    {controlText}
                                </button>
                            ))}
                        </span>
                    </div>
                    <div className="Trends__season-stat-controls Trends__season-stat-controls--stats">
                        <span className="Trends__season-stat-options-wrapper">
                            {Object.entries(_statControls.stats).map(([controlKey, controlText]) => (
                                <button
                                    className={`
                                        Trends__season-stat-option
                                        Trends__season-stat-option--stats
                                        Trends__season-stat-option--${controlKey}
                                        ${_selectedStat === controlKey ? 'Trends__season-stat-option--active' : ''}
                                    `}
                                    onClick={() => _setSelectedStat(controlKey)}
                                >
                                    {controlText}
                                </button>
                            ))}
                        </span>
                    </div>
                    {_selectedTrends &&
                        <div className="Trends__season-stats">
                            <ResponsiveContainer width="99%" height={600}>
                                {_selectedMatchType === 'all' ?
                                    <ComposedChart
                                        data={_selectedTrends}
                                        className="Trends__season-stat-chart"
                                        margin={{ left: -15, right: 2, top: 10, bottom: 10 }}
                                    >
                                        <XAxis dataKey="gameloop" />
                                        <YAxis type="number" domain={['dataMin', 'dataMax']} />
                                        <ReferenceLine y={0} stroke="hsl(0, 0%, 47%)" strokeWidth={1} />
                                        <Tooltip
                                            content={
                                                <TrendsTooltip
                                                    trends={{
                                                        stat: _selectedStat,
                                                        matchup: _trendsMatchup,
                                                        type: _selectedMatchType,
                                                    }}
                                                />
                                            }
                                            position={{ y: -10 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="all.median"
                                            stroke="hsl(210, 68%, 47%)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="all.quartile_range"
                                            stroke="hsl(210, 85%, 60%)"
                                            fill="hsla(210, 85%, 60%, 0.2)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="all.total_range"
                                            stroke="hsla(210, 85%, 60%, 0.4)"
                                            fill="hsla(210, 85%, 60%, 0.1)"
                                        />
                                    </ComposedChart>
                                    :
                                    <ComposedChart
                                        data={_selectedTrends}
                                        className="Trends__season-stat-chart"
                                        margin={{ left: -15, right: 2, top: 10, bottom: 10 }}
                                    >
                                        <XAxis dataKey="gameloop" />
                                        <YAxis type="number" domain={['dataMin', 'dataMax']} />
                                        <ReferenceLine y={0} stroke="hsl(0, 0%, 47%)" strokeWidth={1} />
                                        <Tooltip
                                            content={
                                                <TrendsTooltip
                                                    trends={{
                                                        stat: _selectedStat,
                                                        matchup: _trendsMatchup,
                                                        type: _selectedMatchType,
                                                    }}
                                                />
                                            }
                                            position={{ y: -10 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="win.median"
                                            stroke="hsla(120, 80%, 25%, 1)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="loss.median"
                                            stroke="hsla(0, 70%, 25%, 1)"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="win.quartile_range"
                                            stroke="hsla(120, 80%, 25%, 1)"
                                            fill="hsla(120, 80%, 25%, 0.2)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="loss.quartile_range"
                                            stroke="hsla(0, 70%, 25%, 1)"
                                            fill="hsla(0, 70%, 25%, 0.2)"
                                        />
                                    </ComposedChart>}
                            </ResponsiveContainer>
                        </div>}
                    {!_selectedTrends &&
                        <div className="Trends__season-stats Trends__season-stats--default">
                            No {`${_selectedRace.charAt(0).toUpperCase()}v${_trendsMatchup.charAt(0).toUpperCase()}`} replays found
                        </div>}
                </Fragment>
            ),
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
            _selectedTrends: selectedTrends,
            _statControls: statControls,
            _trendsMatchup: trendsMatchup,
            _setTrendsMatchup: setTrendsMatchup,
            _selectedStat: selectedStat,
            _setSelectedStat: setSelectedStat,
            _selectedMatchType: selectedMatchType,
            _setSelectedMatchType: setSelectedMatchType,
            _selectedMatchLength: selectedMatchLength,
            _setSelectedMatchLength: setSelectedMatchLength,
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
                    Recent Trends
                    <InfoTooltip content={seasonStatsDescription} />
                </h1>
                <TrendsState />
            </div>
        </div>
    );
};

export default Trends;
