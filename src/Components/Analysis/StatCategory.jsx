import TrendStat from './TrendStat';
import './CSS/StatCategory.css';

const StatCategory = (props) => {
    const statOrder = {
        general: {
            winrate: 'Winrate',
            sq: 'SQ',
            apm: 'APM',
            inject_count: 'Inject Count',
        },
        economic: {
            workers_produced: 'Workers Produced',
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
            resources_lost_minerals: 'Avg Minerals Lost',
            resources_lost_gas: 'Avg Gas Lost',
        },
    };

    return (
        <div className="StatCategory" style={{ gridArea: props.category }}>
            <h2 className="StatCategory__title">
                {props.category === 'PAC' ?
                    'Perception Action Cycle (PAC)'
                    :
                    props.category.charAt(0).toUpperCase() + props.category.slice(1)}
            </h2>
            <div className="StatCategory__stats">
                {Object.keys(statOrder[props.category]).map((stat, index) => (
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
