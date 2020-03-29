import ReplayStat from '../Replays/ReplayStat';
import TrendStat from '../Trends/TrendStat';
import InfoTooltip from '../General/InfoTooltip';
import './CSS/StatCategory.css';

const StatCategory = (props) => {
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
                <br />
                <br />
                <span style={{ textDecoration: 'underline' }}>
                    Inject Count
                </span>
                <br />
                Inject Count measures the number of times you inject per game
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
                In theory, a PAC relates to the cycle of a player acquiring, moving to, and executing a task.
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
                    Avg PAC Action Latency
                </span>
                <br />
                Avg PAC Action Latency measures the lag time between the initial camera move and the initial action over all PAC&#39;s in a game
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

    const statOrder = {
        general: {
            winrate: 'Winrate',
            sq: 'Spending Quotient',
            apm: 'Actions Per Minute',
            inject_count: 'Inject Count',
        },
        economic: {
            workers_produced: 'Workers Produced',
            workers_killed: 'Workers Killed',
            workers_lost: 'Workers Lost',
            avg_resource_collection_rate_minerals: 'Avg Mineral Collection Rate',
            avg_resource_collection_rate_gas: 'Avg Gas Collection Rate',
        },
        PAC: {
            avg_pac_actions: 'Avg PAC Actions',
            avg_pac_action_latency: 'Avg PAC Action Latency (s)',
            avg_pac_per_min: 'Avg PAC Per Minute',
            avg_pac_gap: 'Avg PAC Gap (s)',
        },
        efficiency: {
            avg_unspent_resources_minerals: 'Avg Unspent Minerals',
            avg_unspent_resources_gas: 'Avg Unspent Gas',
            resources_lost_minerals: 'Minerals Lost',
            resources_lost_gas: 'Gas Lost',
        },
    };

    return (
        <div
            className={`StatCategory StatCategory--${props.type ? 'replays' : 'trends'}`}
            style={{ gridArea: props.category }}
        >
            <h2 className="StatCategory__title">
                {props.category === 'PAC' ?
                    'Perception Action Cycle (PAC)'
                    :
                    props.category.charAt(0).toUpperCase() + props.category.slice(1)}
                <InfoTooltip content={descriptions[props.category] || 'Loading'} />
            </h2>
            <div className={`StatCategory__stats StatCategory__stats--${props.type ? 'replays' : 'trends'}`}>
                {Object.keys(statOrder[props.category]).map((stat, index) => (
                    props.type === 'replays' && stat !== 'winrate' ?
                        <ReplayStat
                            key={stat}
                            stat={stat}
                            statName={statOrder[props.category][stat]}
                            replayInfo={props.replayInfo}
                            category={props.category}
                            modifier={
                                index === Object.keys(statOrder[props.category]).length - 1 ?
                                    'last' : false
                            }
                        />
                        :
                        <TrendStat
                            key={stat}
                            stat={stat}
                            statName={statOrder[props.category][stat]}
                            trends={props.trends}
                            recentPercentDiff={props.recentPercentDiff}
                            modifier={
                                index === Object.keys(statOrder[props.category]).length - 1 ?
                                    'last' : false
                            }
                        />
                ))}
            </div>
        </div>
    );
};

export default StatCategory;
