import { useDispatch, useSelector } from 'react-redux';
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
// import Tippy from '@tippy.js/react';
import { setTrends } from '../../actions';
import ProfileSection from '../General/ProfileSection';
import StatCategory from './StatCategory';
import InfoTooltip from '../General/InfoTooltip';
import CustomTooltip from '../General/Tooltip';
import './CSS/Analysis.css';

const Analysis = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => `Token ${state.token}`);
    const currentTrends = useSelector(state => state.trends);
    const [playerTrends, setPlayerTrends] = useState(null);
    const [statDropdownState, setStatDropdownState] = useState(0);
    const [lineState, setLineState] = useState({
        winrate: 1,
        sq: 1,
        apm: 1,
        avg_pac_action_latency: 0,
        avg_pac_actions: 0,
        avg_pac_gap: 0,
        avg_pac_per_min: 0,
        workers_produced: 1,
        workers_lost: 0,
        avg_unspent_resources_minerals: 0,
        avg_unspent_resources_gas: 0,
        avg_resource_collection_rate_minerals: 0,
        avg_resource_collection_rate_gas: 0,
        resources_lost_minerals: 0,
        resources_lost_gas: 0,
        inject_count: 0,
    });
    const [timelineData, setTimelineData] = useState([{
        winrate: 0,
        sq: 0,
        apm: 0,
        avg_pac_action_latency: 0,
        avg_pac_actions: 0,
        avg_pac_gap: 0,
        avg_pac_per_min: 0,
        workers_produced: 0,
        workers_lost: 0,
        avg_unspent_resources_minerals: 0,
        avg_unspent_resources_gas: 0,
        avg_resource_collection_rate_minerals: 0,
        avg_resource_collection_rate_gas: 0,
        resources_lost_minerals: 0,
        resources_lost_gas: 0,
        inject_count: 0,
    }]);

    useEffect(() => {
        const getStats = async () => {
            const url = 'http://127.0.0.1:8000/api/stats/';

            const trends = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            }).then(response => (
                response.json()
            )).then(responseBody => (
                JSON.parse(responseBody)
            )).catch(() => (null));

            dispatch(setTrends(trends));
        };
        if (currentTrends) {
            setPlayerTrends(currentTrends.recent);
            setTimelineData(currentTrends.weekly);
        } else {
            getStats();
        }
    }, [currentTrends]);

    const statColours = {
        winrate: 'white',
        sq: 'red',
        apm: 'hsl(210, 68%, 47%)',
        avg_pac_action_latency: 'gold',
        avg_pac_actions: 'orange',
        avg_pac_gap: 'violet',
        avg_pac_per_min: 'cyan',
        workers_produced: 'green',
        workers_lost: 'purple',
        avg_unspent_resources_minerals: '#00FF7F',
        avg_unspent_resources_gas: 'brown',
        avg_resource_collection_rate_minerals: '#014421',
        avg_resource_collection_rate_gas: '#36454F',
        resources_lost_minerals: '#8B008B',
        resources_lost_gas: '#FBEC5D',
        inject_count: 'grey',
    };

    const statNames = {
        winrate: 'Winrate',
        sq: 'SQ',
        apm: 'APM',
        avg_pac_action_latency: 'PAC Action Latency',
        avg_pac_actions: 'PAC Actions',
        avg_pac_gap: 'PAC Gap',
        avg_pac_per_min: 'PAC Per Minute',
        workers_produced: 'Workers Produced',
        workers_lost: 'Workers Lost',
        avg_unspent_resources_minerals: 'Unspent Minerals',
        avg_unspent_resources_gas: 'Unspent Gas',
        avg_resource_collection_rate_minerals: 'Mineral Collection Rate',
        avg_resource_collection_rate_gas: 'Gas Collection Rate',
        resources_lost_minerals: 'Minerals Lost',
        resources_lost_gas: 'Gas Lost',
        inject_count: 'Inject Count',
    };

    const statCategories = ['general', 'economic', 'PAC', 'efficiency'];

    const pageTitle = 'Trend Analysis';

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
                    return `${start.trim()}${fraction} mo ago`;
                }

                if (content.slice(1, 2) === 'm') {
                    return `${content.slice(0, 1)}mo ago`;
                }
                return content;
            }

            case 'chart': {
                if (content.indexOf('*') !== -1) {
                    const [start, fraction] = formatString();
                    return `${start.trim()}${fraction} Months Ago`;
                }

                if (content.slice(1, 2) === 'm') {
                    return `${content.slice(0, 1)} Months Ago`;
                }
                return `${content.slice(0, 1)} Weeks Ago`;
            }

            default:
                return content;
        }
    };

    const mainContent = (
        <Fragment>
            <div className="timeline">
                <h2 className="timeline__title">
                    Weekly Trends
                    <InfoTooltip
                        content={`
                            Percentage differences are limited to +-50%.
                            Weeks with less than 5 games played default to 0%
                        `}
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
                            height: statDropdownState === 0 ? '0px' : '285px',
                        }}
                        className={`timeline__stat-dropdown 
                            ${statDropdownState === 1 ? window.setTimeout(() => (''), 500) : 'timeline__stat-dropdown--open'}`}
                    >
                        {Object.entries(statNames).map(([stat, statName]) => (
                            <li key={stat} className="timeline__stat-dropdown-option">
                                <button
                                    onClick={() => (
                                        lineState[stat] === 1 ?
                                            setLineState(prevState => (
                                                { ...prevState, [stat]: 0 }
                                            ))
                                            :
                                            setLineState(prevState => (
                                                { ...prevState, [stat]: 1 }
                                            ))
                                    )}
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
                            width="100%"
                            height={300}
                        >
                            <LineChart data={timelineData}>
                                <XAxis
                                    tick={{ fontSize: 20 }}
                                    tickFormatter={content => formatTick(content)}
                                    dataKey="date"
                                    dx={-9}
                                    dy={3}
                                />
                                <YAxis
                                    tick={{ fontSize: 20 }}
                                    label={{
                                        value: 'Weekly Percentage Difference (%)',
                                        fontSize: 18,
                                        angle: -90,
                                        dx: -25,
                                        fill: 'hsl(0, 0%, 47%)',
                                    }}
                                    domain={[-50, 50]}
                                    dx={-3}
                                />
                                <CartesianGrid
                                    vertical={false}
                                    stroke="hsl(0, 0%, 47%)"
                                    style={{ marginTop: '10px' }}
                                />
                                <Tooltip
                                    content={
                                        <CustomTooltip
                                            chart="analysis"
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
                        <div className="sk-wave">
                            <div className="sk-rect sk-rect1" />
                            <div className="sk-rect sk-rect2" />
                            <div className="sk-rect sk-rect3" />
                            <div className="sk-rect sk-rect4" />
                            <div className="sk-rect sk-rect5" />
                        </div>
                    )
                }
            </div>
            <div className="recent-trends">
                <h2 className="recent-trends__title">Recent Performance</h2>
                {playerTrends ?
                    (
                        <div className="recent-trends__content">
                            {statCategories.map(category => (
                                <StatCategory
                                    key={category}
                                    category={category}
                                    trends={playerTrends}
                                    recentPercentDiff={timelineData.slice(-1)[0]}
                                />
                            ))}
                        </div>
                    )
                    :
                    (
                        <div className="sk-wave">
                            <div className="sk-rect sk-rect1" />
                            <div className="sk-rect sk-rect2" />
                            <div className="sk-rect sk-rect3" />
                            <div className="sk-rect sk-rect4" />
                            <div className="sk-rect sk-rect5" />
                        </div>
                    )
                }
            </div>
        </Fragment>
    );

    return (
        <div className="Analysis">
            <ProfileSection
                section="Analysis"
                pageTitle={pageTitle}
                mainContent={mainContent}
            />
        </div>
    );
};

export default Analysis;
