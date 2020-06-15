import { useSelector } from 'react-redux';
import { useState, useEffect, Fragment } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Line,
} from 'recharts';
import StatCategory from '../shared/StatCategory';
import StatCorrelations from './StatCorrelations';
import InfoTooltip from '../shared/InfoTooltip';
import TrendsTooltip from './TrendsTooltip';
import DefaultResponse from '../shared/DefaultResponse';
import LoadingAnimation from '../shared/LoadingAnimation';
import './CSS/Trends.css';

const Trends = () => {
    const currentTrends = useSelector(state => state.raceData[state.selectedRace].trends);
    const [playerTrends, setPlayerTrends] = useState(null);
    const [statDropdownState, setStatDropdownState] = useState(0);
    const [statCorrelations, setStatCorrelations] = useState(null);

    if (!localStorage.lineState || JSON.parse(localStorage.lineState).inject_count) {
        localStorage.lineState = JSON.stringify({
            winrate: 1,
            mmr: 0,
            sq: 1,
            apm: 1,
            avg_pac_action_latency: 0,
            avg_pac_actions: 0,
            avg_pac_gap: 0,
            avg_pac_per_min: 0,
            workers_produced: 1,
            workers_killed: 1,
            workers_lost: 1,
            avg_unspent_resources_minerals: 0,
            avg_unspent_resources_gas: 0,
            avg_resource_collection_rate_minerals: 0,
            avg_resource_collection_rate_gas: 0,
            resources_lost_minerals: 0,
            resources_lost_gas: 0,
        });
    }

    const [lineState, setLineState] = useState(JSON.parse(localStorage.lineState));
    const [timelineData, setTimelineData] = useState([{
        winrate: 0,
        mmr: 0,
        sq: 0,
        apm: 0,
        avg_pac_action_latency: 0,
        avg_pac_actions: 0,
        avg_pac_gap: 0,
        avg_pac_per_min: 0,
        workers_produced: 0,
        workers_killed: 0,
        workers_lost: 0,
        avg_unspent_resources_minerals: 0,
        avg_unspent_resources_gas: 0,
        avg_resource_collection_rate_minerals: 0,
        avg_resource_collection_rate_gas: 0,
        resources_lost_minerals: 0,
        resources_lost_gas: 0,
        count: 0,
    }]);

    useEffect(() => {
        localStorage.lineState = JSON.stringify(lineState);
    }, [lineState]);

    useEffect(() => {
        if (currentTrends) {
            setPlayerTrends(currentTrends.recent);
            setTimelineData(currentTrends.weekly);
            setStatCorrelations(currentTrends.correlations);
        } else if (currentTrends === false) {
            setPlayerTrends(null);
            setTimelineData([]);
            setStatCorrelations(null);
        }
    }, [currentTrends]);

    const statColours = {
        winrate: 'white',
        mmr: 'var(--line-shade-1)',
        sq: 'var(--line-shade-2)',
        apm: 'var(--line-shade-3)',
        // avg_pac_action_latency: 'gold',
        // avg_pac_actions: 'orange',
        // avg_pac_gap: 'violet',
        // avg_pac_per_min: 'cyan',
        workers_produced: 'var(--line-shade-4)',
        workers_killed: 'var(--line-shade-5)',
        workers_lost: 'var(--line-shade-6)',
        avg_unspent_resources_minerals: 'var(--line-shade-7)',
        avg_unspent_resources_gas: 'var(--line-shade-8)',
        // avg_resource_collection_rate_minerals: '#014421',
        // avg_resource_collection_rate_gas: '#36454F',
        // resources_lost_minerals: '#8B008B',
        // resources_lost_gas: '#FBEC5D',
        // inject_count: 'var(--line-shade-9)',
    };

    const statNames = {
        winrate: 'Winrate',
        mmr: 'MMR',
        sq: 'SQ',
        apm: 'APM',
        // avg_pac_action_latency: 'PAC Action Latency',
        // avg_pac_actions: 'PAC Actions',
        // avg_pac_gap: 'PAC Gap',
        // avg_pac_per_min: 'PAC Per Minute',
        workers_produced: 'Workers Produced',
        workers_killed: 'Workers Killed',
        workers_lost: 'Workers Lost',
        avg_unspent_resources_minerals: 'Unspent Minerals',
        avg_unspent_resources_gas: 'Unspent Gas',
        // avg_resource_collection_rate_minerals: 'Mineral Collection Rate',
        // avg_resource_collection_rate_gas: 'Gas Collection Rate',
        // resources_lost_minerals: 'Minerals Lost',
        // resources_lost_gas: 'Gas Lost',
        // inject_count: 'Inject Count',
    };

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    const formatTick = (content, type = 'tick') => {
        const formatString = () => {
            const strPieces = content.split('*');
            const [start] = strPieces;
            let fraction;

            switch (strPieces[1].slice(0, 1)) {
                case '1':
                    fraction = '\xBC';
                    break;

                case '2':
                    fraction = '\xBD';
                    break;

                case '3':
                    fraction = '\xBE';
                    break;

                default:
                    break;
            }
            return [start, fraction];
        };

        switch (type) {
            case 'tick': {
                if (content.indexOf('*') !== -1) {
                    const [start, fraction] = formatString();
                    return `${start.trim()}${fraction} mo`;
                }

                if (content.slice(1, 2) === 'm') {
                    return `${content.slice(0, 1)} mo`;
                }

                if (content.slice(2, 3) === 'm') {
                    return `${content.slice(0, 2)} mo`;
                }
                return content;
            }

            case 'chart': {
                if (content.indexOf('*') !== -1) {
                    const [start, fraction] = formatString();
                    return `${start.trim()}${fraction} Month(s) Ago`;
                }

                if (content.slice(1, 2) === 'm') {
                    return `${content.slice(0, 1)} Month(s) Ago`;
                }

                if (content.slice(2, 3) === 'm') {
                    return `${content.slice(0, 2)} Month(s) Ago`;
                }
                return `${content.slice(0, 1)} Week(s) Ago`;
            }

            case 'period': {
                if (content.indexOf('*') !== -1) {
                    const [start, fraction] = formatString();
                    return `${start.trim()}${fraction}`;
                }

                if (content.slice(1, 2) === 'm') {
                    return `${content.slice(0, 1)}`;
                }

                if (content.slice(2, 3) === 'm') {
                    return `${content.slice(0, 2)}`;
                }
                return content;
            }

            default:
                return content;
        }
    };

    return (
        <div className="Trends">
            <div className="timeline">
                <h2 className="timeline__title">
                    Weekly Trends
                    <InfoTooltip
                        content={
                            <span>
                                Weekly stats are the median values for that week.
                                <br />
                                <br />
                                Stat differences are calculated from weekly medians
                                and 3 month medians. The chart is limited to a +-30% difference.
                                <br />
                                <br />
                                The 3 month periods are shown on the tooltip.
                            </span>
                        }
                    />
                </h2>
                <div className="timeline__stat-picker">
                    <button
                        className="timeline__stat-picker-title"
                        onClick={() => (
                            statDropdownState === 1 ?
                                setStatDropdownState(0) : setStatDropdownState(1)
                        )}
                    >
                        Select Stats
                    </button>
                    <ul
                        style={{
                            opacity: statDropdownState,
                            zIndex: statDropdownState,
                            maxHeight: statDropdownState === 0 ? '0px' : '350px',
                        }}
                        className={`timeline__stat-dropdown 
                            ${statDropdownState === 1 ? window.setTimeout(() => (''), 500) : 'timeline__stat-dropdown--open'}`}
                    >
                        {Object.entries(statNames).map(([stat, statName]) => (
                            <li key={stat} className="timeline__stat-dropdown-option">
                                <button
                                    onClick={() => {
                                        if (lineState[stat] === 1) {
                                            setLineState(prevState => (
                                                { ...prevState, [stat]: 0 }
                                            ));
                                        } else {
                                            setLineState(prevState => (
                                                { ...prevState, [stat]: 1 }
                                            ));
                                        }
                                    }}
                                    className="timeline__stat-dropdown-button"
                                >
                                    {statName}&nbsp;&nbsp;
                                    {
                                        <svg height="10" width="10">
                                            <circle
                                                className="timeline__stat-dropdown-indicator"
                                                cx="5"
                                                cy="5"
                                                r="5"
                                                fill="hsl(210, 68%, 47%)"
                                                opacity={lineState[stat]}
                                            />
                                        </svg>
                                    }
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {timelineData.length > 0 ?
                    (
                        <ResponsiveContainer
                            className="chart-area"
                            width="99%"
                            height={400}
                        >
                            <LineChart data={timelineData}>
                                <XAxis
                                    tick={{ fontSize: 16 }}
                                    tickFormatter={content => formatTick(content)}
                                    label={{
                                        value: 'Time Since Current Week',
                                        fontSize: 18,
                                        // angle: -90,
                                        dy: 20,
                                        fill: 'hsl(0, 0%, 47%)',
                                    }}
                                    height={55}
                                    interval={1}
                                    dataKey="date"
                                    dx={-9}
                                    dy={3}
                                />
                                <YAxis
                                    type="number"
                                    scale="linear"
                                    allowDataOverflow
                                    tick={{ fontSize: 16 }}
                                    label={{
                                        value: 'Weekly Percentage Difference (%)',
                                        fontSize: 18,
                                        angle: -90,
                                        dx: -25,
                                        fill: 'hsl(0, 0%, 47%)',
                                    }}
                                    domain={[-30, 30]}
                                    dx={-3}
                                />
                                <CartesianGrid
                                    vertical={false}
                                    stroke="hsl(0, 0%, 47%)"
                                    style={{ marginTop: '10px' }}
                                />
                                <Tooltip
                                    content={
                                        <TrendsTooltip
                                            chart="trends"
                                            lineState={lineState}
                                            tickFormatter={formatTick}
                                        />
                                    }
                                    cursor={{ stroke: 'hsl(0, 0%, 85%)' }}
                                />
                                {Object.keys(statColours).map(stat => (
                                    <Line
                                        key={stat}
                                        type="monotone"
                                        dataKey={`${stat}[1]`}
                                        connectNulls
                                        stroke={statColours[stat]}
                                        strokeWidth={2}
                                        dot={{
                                            r: 4,
                                            fill: 'hsl(240, 80%, 5%)',
                                            strokeWidth: 1,
                                        }}
                                        activeDot={
                                            lineState[stat] === 0 ?
                                                false
                                                :
                                                { stroke: statColours[stat] }
                                        }
                                        style={{
                                            opacity: lineState[stat],
                                            transition: '0.3s',
                                        }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    )
                    :
                    (
                        <p className="recent-trends__one-week">
                            We can&#39;t show any trends because all your
                            replays are from 1 week. Upload more
                            newer/older replays to see your trends.
                        </p>
                    )
                }
            </div>
            {statCorrelations && <StatCorrelations correlations={statCorrelations} />}
            <div className="recent-trends">
                <span className="recent-trends__title-area">
                    <h2 className="recent-trends__title">
                        Recent Performance
                        <InfoTooltip content={
                            <span>
                                Each statistic has the current weekly median and Median Average Difference (MAD) displayed next to it, as well as the difference compared to the previous week below
                                <br />
                                <br />
                                The main value is the median and the +/- values is the MAD, which is a measure of spread
                                <br />
                                <br />
                                Green and red highlighted values represent the median and MAD for wins and losses respectively
                                <br />
                                <br />
                                Win/loss values also show the difference between the overall median and the win/loss median
                            </span>}
                        />
                    </h2>
                    <h3 className="recent-trends__winrate">
                        {playerTrends && (
                            <Fragment>
                                <span className={playerTrends.winrate >= 50 ?
                                    'TrendStat__trend--positive' : 'TrendStat__trend--negative'}
                                >
                                    {playerTrends.winrate}
                                </span>% over {playerTrends.count} games&#160;
                                {timelineData.length > 0 &&
                                    <small>
                                        ({timelineData.slice(-1)[0].winrate[1] >= 0 ?
                                            <span className="TrendStat__trend--positive">
                                                +{timelineData.slice(-1)[0].winrate[1]}
                                            </span>
                                            :
                                            <span className="TrendStat__trend--negative">
                                                -{timelineData.slice(-1)[0].winrate[1]}
                                            </span>}% this week)
                                    </small>}
                            </Fragment>)}
                    </h3>
                </span>
                {playerTrends &&
                    <div className="recent-trends__content">
                        {statCategories.map(category => (
                            <StatCategory
                                key={category}
                                category={category}
                                trends={playerTrends}
                                recentPercentDiff={timelineData.slice(-1)[0]}
                            />
                        ))}
                    </div>}
                {!currentTrends && (currentTrends === null ?
                    <LoadingAnimation />
                    :
                    <DefaultResponse />)}
            </div>
        </div>
    );
};

export default Trends;
