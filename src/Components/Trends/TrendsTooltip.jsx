import { Fragment } from 'react';
import './CSS/TrendsTooltip.css';

const TrendsTooltip = ({ payload, label, lineState, tickFormatter }) => {
    let content = null;

    const statOrder = {
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
        inject_count: 'Inject Count',
    };

    const colours = {
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
        inject_count: 'var(--line-shade-9)',
    };

    if (payload !== undefined && payload.length !== 0) {
        content = (
            <Fragment>
                <ul className="Tooltip__content">
                    <li className="Tooltip__title">
                        {tickFormatter(label, 'chart')}
                    </li>
                    <li className="Tooltip__games">
                        {payload[0].payload.count}&nbsp;/&nbsp;
                        {payload[0].payload.total_count} Games
                    </li>
                    {payload.map((_payload, index) => {
                        const key = payload[index].dataKey.slice(0, -3);

                        return (
                            lineState[_payload.name.slice(0, -3)] === 0 ?
                                null
                                :
                                <li key={`${key}-${index}-stat`} className="Tooltip__stat">
                                    <svg key={`${key}-${index}-svg`} height="10" width="10">
                                        <circle key={`${key}-circle`} cx="5" cy="5" r="5" fill={colours[key]} />
                                    </svg>&nbsp;
                                    <span key={`${key}-${index}-span`}>
                                        {statOrder[_payload.name.slice(0, -3)]}
                                    </span>&nbsp;
                                    {_payload.name.slice(0, -3) === 'winrate' ?
                                        `${_payload.payload[key][0]}%`
                                        :
                                        _payload.payload[key][0]} (
                                    <span
                                        key={`${key}-${index}-value`}
                                        className={
                                            `Tooltip__value ${_payload.payload[key][1] > 0 ?
                                                `Tooltip__value--positive Tooltip__value--${key}-positive`
                                                :
                                                `Tooltip__value--negative Tooltip__value--${key}-negative`}`
                                        }
                                    >
                                        {_payload.payload[key][1] > 0 ?
                                            `+${_payload.payload[key][1]}`
                                            :
                                            _payload.payload[key][1]}%
                                    </span>)
                                </li>
                        );
                    })}
                    <li className="Tooltip__games" style={{ margin: '10px 0 0', textAlign: 'center' }}>
                        3-Month Period:&nbsp;
                        {tickFormatter(payload[0].payload.start_date, 'period')}
                        -
                        {tickFormatter(payload[0].payload.end_date, 'period')}
                        &nbsp;mo
                    </li>
                </ul>
            </Fragment>
        );
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

export default TrendsTooltip;
