import { Fragment } from 'react';
import './CSS/Tooltip.css';

const CustomTooltip = (props) => {
    let content = null;

    const statOrder = {
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

    const colours = {
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

    if (props.payload !== undefined && props.payload.length !== 0) {
        switch (props.chart) {
            case 'analysis':
                content = (
                    <Fragment>
                        <ul className="Tooltip__content">
                            <li className="Tooltip__title">
                                {props.tickFormatter(props.label, 'chart')}
                            </li>
                            <li className="Tooltip__games">
                                {props.payload[0].payload.count < 5 ?
                                    '<5' : props.payload[0].payload.count} Games
                            </li>
                            {props.payload.map((payload, index) => {
                                const key = props.payload[index].dataKey.slice(0, -3);

                                return (
                                    props.lineState[payload.name.slice(0, -3)] === 0 ?
                                        null
                                        :
                                        <li key={`${key}-${index}-stat`} className="Tooltip__stat">
                                            <svg key={`${key}-${index}-svg`} height="10" width="10">
                                                <circle key={`${key}-circle`} cx="5" cy="5" r="5" fill={colours[key]} />
                                            </svg>&nbsp;
                                            <span key={`${key}-${index}-span`}>
                                                {statOrder[payload.name.slice(0, -3)]}
                                            </span>&nbsp;
                                            {payload.name.slice(0, -3) === 'winrate' ?
                                                `${payload.payload[key][0]}%`
                                                :
                                                payload.payload[key][0]} (
                                            <span
                                                key={`${key}-${index}-value`}
                                                className={
                                                    `Tooltip__value ${payload.payload[key][1] > 0 ?
                                                        `Tooltip__value--positive Tooltip__value--${key}-positive`
                                                        :
                                                        `Tooltip__value--negative Tooltip__value--${key}-negative`}`
                                                }
                                            >
                                                {payload.payload[key][1] > 0 ?
                                                    `+${payload.payload[key][1]}`
                                                    :
                                                    payload.payload[key][1]}%
                                            </span>)
                                        </li>
                                );
                            })}
                        </ul>
                    </Fragment>
                );
                break;

            default:
                break;
        }
    }

    if (content) {
        return (
            <div id="tooltip">
                {content}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
