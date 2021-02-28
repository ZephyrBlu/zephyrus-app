import { useSelector } from 'react-redux';
import React, { useState, useEffect, Fragment } from 'react';
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
import { capitalize } from '../../utils';
import LoadingState from '../shared/LoadingState';
import LoadingAnimation from '../shared/LoadingAnimation';
import InfoTooltip from '../shared/InfoTooltip';
import TrendsTooltip from './TrendsTooltip';
import './CSS/Trends.css';

const Trends = () => {
    const selectedRace = useSelector(state => state.selectedRace);
    const currentTrends = useSelector(state => state.raceData[state.selectedRace].trends);
    const [selectedTrends, setSelectedTrends] = useState({
        replays: {
            winrate: null,
            count: null,
        },
        trends: null,
    });
    const [trendsMatchup, setTrendsMatchup] = useState('all');
    const [selectedStat, setSelectedStat] = useState('workers_active');
    const [selectedMatchType, setSelectedMatchType] = useState('all');
    const [selectedMatchLength, setSelectedMatchLength] = useState('all');

    useEffect(() => {
        const filterTrends = (trendData) => {
            const filteredTrends = [];
            Object.entries(trendData.trends[selectedStat]).forEach(([gameloop, matchData]) => {
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
                        [0.05, 0.25, 0.5, 0.75, 0.95],
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

            const replays = {
                wins: 0,
                losses: 0,
            };
            trendData.replays.forEach((replay) => {
                if ((trendsMatchup === 'all' || trendsMatchup === replay.matchup) && (selectedMatchLength === 'all' || selectedMatchLength === replay.stage)) {
                    if (replay.win) {
                        replays.wins += 1;
                    } else {
                        replays.losses += 1;
                    }
                }
            });

            return {
                replays: {
                    winrate: Number(((replays.wins / (replays.wins + replays.losses)) * 100).toFixed(1)),
                    count: replays.wins + replays.losses,
                },
                trends: filteredTrends,
            };
        };
        if (currentTrends) {
            setSelectedTrends(filterTrends(currentTrends));
        }
    }, [currentTrends, trendsMatchup, selectedStat, selectedMatchType, selectedMatchLength]);

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
            early: 'Early',
            mid: 'Mid',
            late: 'Late',
        },
        stats: {
            workers_active: 'Workers Active',
            total_collection_rate: 'Collection Rate',
            total_army_value: 'Army Value',
            workers_lost: 'Workers Lost',
            workers_killed: 'Workers Killed',
            total_resources_lost: 'Resources Lost',
            total_unspent_resources: 'Unspent Resources',
        },
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

    const seasonStatsDescription = (
        <p className="Trends__season-stat-description">
            Recent Trends aggregates the timelines of all your recent games (Up to 500) and creates an average timeline of all your games
            <br />
            <br />
            Games with a length of &lt;60sec are eliminated.
            <br />
            <br />
            Early, Mid and Late game are determined by the Max Collection Rate of both players.
            <br />
            <br />
            &lt;2 Base Saturation for Early-game, 2-3 Base Saturation for Mid-game and &gt;3 Base Saturation for Late-game
            <br />
            <br />
            Both players must have Max Collection Rates above these thresholds for a game to be counted in that category.
        </p>
    );

    return (
        <div className="Trends">
            <div className="Trends__season">
                <h1 className="Trends__title">
                    Recent Trends
                    <InfoTooltip content={seasonStatsDescription} style={{ top: '3px' }} />
                </h1>
                <LoadingState
                    success={currentTrends}
                    notFound={currentTrends === false}
                    spinner={
                        <Fragment>
                            <div
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'center',
                                    marginBottom: '-20px',
                                }}
                            >
                                This might take a minute or so...
                            </div>
                            <LoadingAnimation />
                        </Fragment>
                    }
                >
                    <Fragment>
                        <div className="Trends__title-stat">
                            <div className="Trends__title-value Trends__title-value--first">
                                {selectedTrends.replays.winrate}%
                            </div>
                            <span className="Trends__title-text">
                                winrate {(trendsMatchup !== 'all' || selectedMatchLength !== 'all') && 'in'}
                            </span>
                            {selectedMatchLength !== 'all' &&
                                <div className="Trends__title-value">
                                    {selectedMatchLength !== 'all' ? `${capitalize(selectedMatchLength)}-game ` : ''}
                                </div>}
                            {trendsMatchup !== 'all' &&
                                <div className="Trends__title-value">
                                    {`${selectedRace.charAt(0).toUpperCase()}v${trendsMatchup.charAt(0).toUpperCase()}`}
                                </div>}
                            <span className="Trends__title-text">
                                over
                            </span>
                            <div className="Trends__title-value">
                                {selectedTrends.replays.count}
                            </div>
                            <span className="Trends__title-text">
                                games
                            </span>
                        </div>
                        <div className="Trends__season-stat-controls Trends__season-stat-controls--global">
                            <span className="Trends__season-stat-options-wrapper">
                                {Object.entries(statControls.type).map(([controlKey, controlText]) => (
                                    <button
                                        key={controlKey}
                                        className={`
                                            Trends__season-stat-option
                                            Trends__season-stat-option--type
                                            Trends__season-stat-option--${controlKey}
                                            ${selectedMatchType === controlKey ? 'Trends__season-stat-option--active' : ''}
                                        `}
                                        onClick={() => setSelectedMatchType(controlKey)}
                                    >
                                        {controlText}
                                    </button>
                                ))}
                            </span>
                            <span className="Trends__season-stat-options-wrapper">
                                {Object.entries(statControls.matchup).map(([controlKey, controlText]) => (
                                    <button
                                        key={controlKey}
                                        className={`
                                            Trends__season-stat-option
                                            Trends__season-stat-option--matchup
                                            Trends__season-stat-option--${controlKey}
                                            ${trendsMatchup === controlKey ? 'Trends__season-stat-option--active' : ''}
                                        `}
                                        onClick={() => setTrendsMatchup(controlKey)}
                                    >
                                        {controlText}
                                    </button>
                                ))}
                            </span>
                            <span className="Trends__season-stat-options-wrapper">
                                {Object.entries(statControls.length).map(([controlKey, controlText]) => (
                                    <button
                                        key={controlKey}
                                        className={`
                                            Trends__season-stat-option
                                            Trends__season-stat-option--length
                                            Trends__season-stat-option--${controlKey}
                                            ${selectedMatchLength === controlKey ? 'Trends__season-stat-option--active' : ''}
                                        `}
                                        onClick={() => setSelectedMatchLength(controlKey)}
                                    >
                                        {controlText}
                                    </button>
                                ))}
                            </span>
                        </div>
                        <div className="Trends__season-stat-controls Trends__season-stat-controls--stats">
                            <span className="Trends__season-stat-options-wrapper">
                                {Object.entries(statControls.stats).map(([controlKey, controlText]) => (
                                    <button
                                        key={controlKey}
                                        className={`
                                            Trends__season-stat-option
                                            Trends__season-stat-option--stats
                                            Trends__season-stat-option--${controlKey}
                                            ${selectedStat === controlKey ? 'Trends__season-stat-option--active' : ''}
                                        `}
                                        onClick={() => setSelectedStat(controlKey)}
                                    >
                                        {controlText}
                                    </button>
                                ))}
                            </span>
                        </div>
                        {selectedTrends.trends && selectedTrends.trends.length >= 10 &&
                            <div className="Trends__season-stats">
                                <ResponsiveContainer width="99%" height={600}>
                                    {selectedMatchType === 'all' ?
                                        <ComposedChart
                                            data={selectedTrends.trends}
                                            className="Trends__season-stat-chart"
                                            margin={{ left: -15, right: 2, top: 10, bottom: 10 }}
                                        >
                                            <XAxis dataKey="gameloop" tickFormatter={content => formatTick(content)} />
                                            <YAxis type="number" />
                                            <ReferenceLine y={0} stroke="hsl(0, 0%, 47%)" strokeWidth={1} />
                                            <Tooltip
                                                content={
                                                    <TrendsTooltip
                                                        trends={{
                                                            stat: selectedStat,
                                                            stage: selectedMatchLength,
                                                            matchup: `${selectedRace.charAt(0).toUpperCase()}v${trendsMatchup.charAt(0).toUpperCase()}`,
                                                            type: selectedMatchType,
                                                        }}
                                                    />
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="all.median"
                                                stroke="hsl(210, 68%, 47%)"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    stroke: 'hsl(210, 68%, 47%)',
                                                    fill: 'hsl(210, 68%, 47%)',
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="all.quartile_range"
                                                stroke="hsl(210, 85%, 60%)"
                                                fill="hsla(210, 85%, 60%, 0.2)"
                                                activeDot={false}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="all.total_range"
                                                stroke="hsla(210, 85%, 60%, 0.4)"
                                                fill="hsla(210, 85%, 60%, 0.1)"
                                                activeDot={false}
                                            />
                                        </ComposedChart>
                                        :
                                        <ComposedChart
                                            data={selectedTrends.trends}
                                            className="Trends__season-stat-chart"
                                            margin={{ left: -15, right: 2, top: 10, bottom: 10 }}
                                        >
                                            <XAxis dataKey="gameloop" tickFormatter={content => formatTick(content)} />
                                            <YAxis type="number" />
                                            <ReferenceLine y={0} stroke="hsl(0, 0%, 47%)" strokeWidth={1} />
                                            <Tooltip
                                                content={
                                                    <TrendsTooltip
                                                        trends={{
                                                            stat: selectedStat,
                                                            stage: selectedMatchLength,
                                                            matchup: `${selectedRace.charAt(0).toUpperCase()}v${trendsMatchup.charAt(0).toUpperCase()}`,
                                                            type: selectedMatchType,
                                                        }}
                                                    />
                                                }
                                            />
                                            {/* <Area
                                                type="monotone"
                                                dataKey="win.total_range"
                                                stroke="hsla(120, 80%, 25%, 0.2)"
                                                fill="hsla(120, 80%, 25%, 0.05)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="loss.total_range"
                                                stroke="hsla(0, 70%, 25%, 0.2)"
                                                fill="hsla(0, 70%, 25%, 0.05)"
                                            /> */}
                                            <Area
                                                type="monotone"
                                                dataKey="win.quartile_range"
                                                stroke="hsla(120, 80%, 25%, 0.6)"
                                                fill="hsla(120, 80%, 25%, 0.1)"
                                                activeDot={false}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="loss.quartile_range"
                                                stroke="hsla(0, 70%, 25%, 0.6)"
                                                fill="hsla(0, 70%, 25%, 0.1)"
                                                activeDot={false}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="win.median"
                                                stroke="hsla(120, 80%, 25%, 1)"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    stroke: 'hsla(120, 80%, 25%, 1)',
                                                    fill: 'hsla(120, 80%, 25%, 1)',
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="loss.median"
                                                stroke="hsla(0, 70%, 25%, 1)"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    stroke: 'hsla(0, 70%, 25%, 1)',
                                                    fill: 'hsla(0, 70%, 25%, 1)',
                                                }}
                                            />
                                        </ComposedChart>}
                                </ResponsiveContainer>
                            </div>}
                        {(!selectedTrends.trends || selectedTrends.trends.length < 10) &&
                            <div className="Trends__season-stats Trends__season-stats--default">
                                Insufficient data for selected filters
                            </div>}
                    </Fragment>
                </LoadingState>
            </div>
        </div>
    );
};

export default Trends;
