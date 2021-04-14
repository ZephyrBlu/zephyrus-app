import React, { useMemo } from 'react';
import ReplayStat from '../Replays/ReplayStat';
import InfoTooltip from './InfoTooltip';
import './CSS/StatCategory.css';

const StatCategory = ({ category, replay }) => {
    const descriptions = {
        general: (
            <p style={{ margin: 0, textAlign: 'left' }}>
                <span style={{ textDecoration: 'underline' }}>
                    Spending Quotient (SQ)
                </span>
                <br />
                SQ measures the efficiency of your resource spending
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Actions Per Minute (APM)
                </span>
                <br />
                APM measures the number of game actions you perform per minute
            </p>),
        economic: (
            <p style={{ margin: 0, textAlign: 'left' }}>
                <span style={{ textDecoration: 'underline' }}>
                    Workers Produced
                </span>
                <br />
                Workers Produced measures the number of workers you created during a game.
                This does not include the starting 12 workers
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Workers Lost
                </span>
                <br />
                Workers Lost measures the number of your workers that died during a game.
                This includes workers killed by you
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg Mineral Collection Rate
                </span>
                <br />
                Avg Mineral Collection Rate measures your mean mineral collection rate over a game
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg Gas Collection Rate
                </span>
                <br />
                Avg Gas Collection Rate measures your mean gas collection rate over a game
            </p>),
        PAC: (
            <p style={{ margin: 0, textAlign: 'left' }}>
                In theory, a Perception Action Cycle (PAC) relates to the cycle of a player acquiring, moving to, and executing a task.
                For a PAC to be recorded there are a couple of constraints: The camera must move 6 game units and the PAC must last at least 0.2s.
                <br />
                <br />
                All relevant actions and camera moves are recorded for each PAC. This metric probably needs some refinement
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg PAC Actions
                </span>
                <br />
                Avg PAC Actions measures the mean number of relevant actions recorded over all PAC&#39;s in a game
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg Action Latency
                </span>
                <br />
                Avg Action Latency measures the lag time between the initial camera move and the initial action over all PAC&#39;s in a game
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg PAC Per Minute
                </span>
                <br />
                Avg PAC Per Minute measures the number of PAC&#39;s per minute over a game.
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg PAC Gap
                </span>
                <br />
                Avg PAC Gap measures the mean amount of time between PAC&#39;s over a game
            </p>),
        efficiency: (
            <p style={{ margin: 0, textAlign: 'left' }}>
                <span style={{ textDecoration: 'underline' }}>
                    Avg Unspent Minerals
                </span>
                <br />
                Avg Unspent Minerals measures the mean amount of unspent minerals you banked at any point during a game
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Avg Unspent Gas
                </span>
                <br />
                Avg Unspent Gas measures the mean amount of unspent gas you banked at any point during a game
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Minerals Lost
                </span>
                <br />
                Minerals Lost measures the amount of minerals invested into army that you lost over a game
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Gas Lost
                </span>
                <br />
                Gas Lost measures the amount of gas invested into army that you lost over a game
            </p>),
    };

    console.log(replay);

    const statOrder = {
        general: {
            sq: 'Spending Quotient',
            supply_block: 'Supply Block (s)',
            apm: 'Actions Per Minute',
            spm: 'Screens Per Minute',
        },
        economic: {
            workers_produced: 'Workers Produced',
            workers_killed: 'Workers Killed',
            workers_lost: 'Workers Lost',
            avg_collection_rate: 'Avg Collection Rate',
            resources_collected: 'Resources Collected',
        },
        PAC: {
            avg_pac_actions: 'Avg PAC Actions',
            avg_pac_action_latency: 'Avg Action Latency (s)',
            avg_pac_per_min: 'Avg PAC Per Minute',
            avg_pac_gap: 'Avg PAC Gap (s)',
        },
        efficiency: {
            avg_unspent_resources: 'Avg Unspent Resources',
            resources_lost: 'Resources Lost',
        },
    };

    const generatedStats = useMemo(() => {
        switch (category) {
            case 'general':
                return {
                    sq: {
                        1: replay.info.sq[1],
                        2: replay.info.sq[2],
                    },
                    supply_block: {
                        1: replay.info.supply_block[1],
                        2: replay.info.supply_block[2],
                    },
                    apm: {
                        1: replay.info.apm[1],
                        2: replay.info.apm[2],
                    },
                    spm: {
                        1: Math.round(replay.info.spm[1]),
                        2: Math.round(replay.info.spm[2]),
                    },
                };

            case 'economic':
                return {
                    workers_produced: {
                        1: replay.info.workers_produced[1],
                        2: replay.info.workers_produced[2],
                    },
                    workers_killed: {
                        1: replay.info.workers_killed[1],
                        2: replay.info.workers_killed[2],
                    },
                    workers_lost: {
                        1: replay.info.workers_lost[1],
                        2: replay.info.workers_lost[2],
                    },
                    avg_collection_rate: {
                        1: [
                            Math.round(replay.info.avg_resource_collection_rate_minerals[1]),
                            Math.round(replay.info.avg_resource_collection_rate_gas[1]),
                        ],
                        2: [
                            Math.round(replay.info.avg_resource_collection_rate_minerals[2]),
                            Math.round(replay.info.avg_resource_collection_rate_gas[2]),
                        ],
                    },
                    resources_collected: {
                        1: [
                            `${(replay.info.resources_collected_minerals[1] / 1000).toFixed(1)}k`,
                            `${(replay.info.resources_collected_gas[1] / 1000).toFixed(1)}k`,
                        ],
                        2: [
                            `${(replay.info.resources_collected_minerals[2] / 1000).toFixed(1)}k`,
                            `${(replay.info.resources_collected_gas[2] / 1000).toFixed(1)}k`,
                        ],
                    },
                };

            case 'PAC':
                return {
                    avg_pac_actions: {
                        1: replay.info.avg_pac_actions[1].toFixed(1),
                        2: replay.info.avg_pac_actions[2].toFixed(1),
                    },
                    avg_pac_action_latency: {
                        1: replay.info.avg_pac_action_latency[1].toFixed(1),
                        2: replay.info.avg_pac_action_latency[2].toFixed(1),
                    },
                    avg_pac_per_min: {
                        1: replay.info.avg_pac_per_min[1].toFixed(1),
                        2: replay.info.avg_pac_per_min[2].toFixed(1),
                    },
                    avg_pac_gap: {
                        1: replay.info.avg_pac_gap[1].toFixed(1),
                        2: replay.info.avg_pac_gap[2].toFixed(1),
                    },
                };

            case 'efficiency':
                return {
                    avg_unspent_resources: {
                        1: [
                            Math.round(replay.info.avg_unspent_resources_minerals[1]),
                            Math.round(replay.info.avg_unspent_resources_gas[1]),
                        ],
                        2: [
                            Math.round(replay.info.avg_unspent_resources_minerals[2]),
                            Math.round(replay.info.avg_unspent_resources_gas[2]),
                        ],
                    },
                    resources_lost: {
                        1: [
                            `${(replay.info.resources_lost_minerals[1] / 1000).toFixed(1)}k`,
                            `${(replay.info.resources_lost_gas[1] / 1000).toFixed(1)}k`,
                        ],
                        2: [
                            `${(replay.info.resources_lost_minerals[2] / 1000).toFixed(1)}k`,
                            `${(replay.info.resources_lost_gas[2] / 1000).toFixed(1)}k`,
                        ],
                    },
                };

            default:
                return {};
        }
    }, [category, replay.info]);

    const clanTagIndex = name => (
        name.indexOf('>') === -1 ? 0 : name.indexOf('>') + 1
    );

    return (
        <div
            className="StatCategory"
            style={{ gridArea: category }}
        >
            <div className="StatCategory__info">
                <h2 className="StatCategory__title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <InfoTooltip content={descriptions[category]} />
                </h2>
                <div className="StatCategory__players">
                    {[replay.info.user_match_id, replay.info.user_match_id === 1 ? 2 : 1].map(playerId => (
                        <div key={playerId} className="StatCategory__player">
                            <img
                                className="StatCategory__player-icon"
                                src={`../../icons/${replay.data.players[playerId].race.toLowerCase()}-logo.svg`}
                                alt={replay.data.players[playerId].race}
                            />
                            <h3 className="StatCategory__player-name">
                                {replay.data.players[playerId].name.slice(clanTagIndex(replay.data.players[playerId].name))}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
            <table className="StatCategory__stats">
                <tbody>
                    {Object.keys(statOrder[category]).map((stat, index) => (
                        <ReplayStat
                            key={stat}
                            userId={replay.info.user_match_id}
                            stat={stat}
                            statName={statOrder[category][stat]}
                            statInfo={generatedStats[stat]}
                            percentile={replay.data.percentile[stat]}
                            category={category}
                            modifier={
                                index === Object.keys(statOrder[category]).length - 1 ?
                                    'last' : false
                            }
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StatCategory;
