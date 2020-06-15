import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './CSS/RaceState.css';

const RaceState = ({ players, timelineState }) => {
    const abilityNames = {
        ScannerSweep: 'Scan',
        SupplyDrop: 'Supply Drop',
        CalldownMULE: 'MULE',
        ChronoBoostEnergyCost: 'Chronoboost',
        NexusMassRecall: 'Mass Recall',
    };

    const energyCommandStructures = {
        Protoss: 'Nexus',
        Terran: 'OrbitalCommand',
    };

    const formatEnergyData = (energyData, playerId) => {
        const commandStructureEnergy = energyData[energyCommandStructures[players[playerId].race]];
        const formattedData = {};

        commandStructureEnergy.forEach((building, index) => {
            formattedData[`building${index}`] = building[0];
        });

        return [formattedData];
    };

    const formatInjectData = (injectData) => {
        const formattedData = {};

        injectData.forEach((building, index) => {
            formattedData[`building${index}`] = building[0];
        });

        return [formattedData];
    };

    const transposeEnergyData = (energyData) => {
        // energy values, energy efficiency, energy idle time
        const formattedData = [[], [], []];

        Object.values(energyData)[0].forEach((building) => {
            formattedData[0].push(Math.round(building[0], 0));
            formattedData[1].push(`${Math.round(building[1] * 100, 0)}%`);
            formattedData[2].push(`${Math.round(building[2], 0)}s`);
        });

        return formattedData;
    };

    const formatResourceData = (data) => {
        const resourceData = {
            army_value: { name: 'Army Value' },
            resources_lost: { name: 'Resources Lost' },
        };

        Object.entries(data).forEach(([playerId, gameState]) => {
            resourceData.army_value[playerId] = gameState.army_value;
            resourceData.resources_lost[playerId] = gameState.resources_lost;
        });

        const total_army_values = { minerals: 0, gas: 0 };
        total_army_values.minerals += resourceData.army_value[1].minerals + resourceData.army_value[2].minerals;
        total_army_values.gas += resourceData.army_value[1].gas + resourceData.army_value[2].gas;

        resourceData.army_value[1] = {
            ...resourceData.army_value[1],
            mineralsPercent: total_army_values.minerals
                ? resourceData.army_value[1].minerals / total_army_values.minerals
                : 0,
            gasPercent: total_army_values.gas
                ? resourceData.army_value[1].gas / total_army_values.gas
                : 0,
        };

        resourceData.army_value[2] = {
            ...resourceData.army_value[2],
            mineralsPercent: total_army_values.minerals
                ? resourceData.army_value[2].minerals / total_army_values.minerals
                : 0,
            gasPercent: total_army_values.gas
                ? resourceData.army_value[2].gas / total_army_values.gas
                : 0,
        };

        const total_resources_lost = { minerals: 0, gas: 0 };
        total_resources_lost.minerals += resourceData.resources_lost[1].minerals + resourceData.resources_lost[2].minerals;
        total_resources_lost.gas += resourceData.resources_lost[1].gas + resourceData.resources_lost[2].gas;

        resourceData.resources_lost[1] = {
            ...resourceData.resources_lost[1],
            mineralsPercent: total_resources_lost.minerals
                ? resourceData.resources_lost[1].minerals / total_resources_lost.minerals
                : 0,
            gasPercent: total_resources_lost.gas
                ? resourceData.resources_lost[1].gas / total_resources_lost.gas
                : 0,
        };

        resourceData.resources_lost[2] = {
            ...resourceData.resources_lost[2],
            mineralsPercent: total_resources_lost.minerals
                ? resourceData.resources_lost[2].minerals / total_resources_lost.minerals
                : 0,
            gasPercent: total_resources_lost.gas
                ? resourceData.resources_lost[2].gas / total_resources_lost.gas
                : 0,
        };

        return Object.values(resourceData);
    };

    const resourceBarStrokeWidth = 0;
    const resourceBarStrokeOpacity = 0;

    return (
        <div className="RaceState">
            <div className="RaceState__resource-metrics">
                <h2 className="RaceState__resource-chart-title">Army Value</h2>
                <ResponsiveContainer width="99%" height={34}>
                    <BarChart
                        layout="vertical"
                        barGap={2}
                        barSize={10}
                        maxBarSize={10}
                        data={[formatResourceData(timelineState)[0]]}
                    >
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis type="category" hide />
                        <Tooltip wrapperStyle={{ zIndex: 9999 }} content={<RaceStateTooltip />} cursor={false} />
                        <Bar dataKey="1.mineralsPercent" stackId="minerals" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[10, 0, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="1.gasPercent" stackId="gas" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 0, 10]} isAnimationActive={false} />
                        <Bar dataKey="2.mineralsPercent" stackId="minerals" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 10, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="2.gasPercent" stackId="gas" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 10, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
                <h2 className="RaceState__resource-chart-title">Resources Lost</h2>
                <ResponsiveContainer width="99%" height={34}>
                    <BarChart
                        layout="vertical"
                        barGap={2}
                        barSize={10}
                        maxBarSize={10}
                        data={[formatResourceData(timelineState)[1]]}
                    >
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis type="category" hide />
                        <Tooltip content={<RaceStateTooltip />} cursor={false} />
                        <Bar dataKey="1.mineralsPercent" stackId="minerals" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[10, 0, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="1.gasPercent" stackId="gas" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 0, 10]} isAnimationActive={false} />
                        <Bar dataKey="2.mineralsPercent" stackId="minerals" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 10, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="2.gasPercent" stackId="gas" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 10, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {Object.values(timelineState).map((playerState, index) => (
                <div key={`player-state-${index + 1}`} className={`RaceState__player RaceState__player--player${index + 1}`}>
                    {(players[index + 1].race === 'Protoss' || players[index + 1].race === 'Terran') &&
                        <div className="RaceState__energy-usage">
                            {players[index + 1].race === 'Protoss' && playerState.race.ability_targets &&
                                Object.entries(playerState.race.ability_targets).map(([building, count]) => (
                                    <div className="RaceState__usage-values">
                                        {building.split(/(?=[A-Z])/).map(name => (
                                            `${name} `
                                        ))}
                                        <div className="RaceState__usage-count">
                                            {count}
                                        </div>
                                    </div>
                                ))}
                            {players[index + 1].race === 'Terran' && playerState.race.abilities_used &&
                                Object.entries(playerState.race.abilities_used).map(([ability, count]) => (
                                    <div className="RaceState__usage-values">
                                        {abilityNames[ability]}&nbsp;
                                        <div className="RaceState__usage-count">
                                            {count}
                                        </div>
                                    </div>
                                ))}
                        </div>}
                    {playerState.race.energy &&
                        <div className="RaceState__energy">
                            <BarChart
                                width={10 + (Object.values(playerState.race.energy)[0].length * 35)}
                                height={50}
                                barGap={10}
                                data={formatEnergyData(playerState.race.energy, index + 1)}
                            >
                                <YAxis type="number" domain={[0, 200]} hide />
                                {playerState.race.energy[energyCommandStructures[players[index + 1].race]].map((building, i) => (
                                    <Bar
                                        key={`energy-building-${building}`}
                                        dataKey={`building${i}`}
                                        fill="hsl(270, 100%, 45%)"
                                        isAnimationActive={false}
                                        barSize={25}
                                        maxBarSize={25}
                                        radius={5}
                                    />
                                ))}
                            </BarChart>
                            <table className="RaceState__energy-table">
                                <tbody>
                                    {transposeEnergyData(playerState.race.energy).map(energyMetric => (
                                        <tr key={`energy-metric-${energyMetric}`} className="RaceState__energy-metric">
                                            {energyMetric.map((value, i) => (
                                                <td key={`energy-value-${value}-${i}`} className="RaceState__energy-metric-value">{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}
                    {playerState.race.inject_efficiency &&
                        <div className="RaceState__inject-efficiency-wrapper">
                            <BarChart
                                width={playerState.race.inject_efficiency.reduce((count, values) => (
                                    values.length > 1 ? count + 1 : count
                                ), 0) * 40}
                                height={65}
                                barGap={10}
                                data={formatInjectData(playerState.race.inject_efficiency)}
                            >
                                <YAxis type="number" domain={[0, 1]} hide />
                                {playerState.race.inject_efficiency.map((values, i) => (
                                    values.length > 1 &&
                                        <Bar
                                            key={`inject-building-${i}`}
                                            dataKey={`building${i}`}
                                            fill="hsl(270, 100%, 45%)"
                                            isAnimationActive={false}
                                            barSize={25}
                                            maxBarSize={25}
                                            radius={5}
                                        />
                                ))}
                            </BarChart>
                            <table className="RaceState__inject-efficiency">
                                <tbody>
                                    <tr className="RaceState__efficiency-metric">
                                        {playerState.race.inject_efficiency.map((values, i) => (
                                            values.length > 1 &&
                                                <td
                                                    key={`inject-value-${values[0]}-${i}`}
                                                    className="RaceState__inject-efficiency-value"
                                                >
                                                    {Math.round(values[0] * 100, 0)}%
                                                </td>
                                        ))}
                                    </tr>
                                    <tr className="RaceState__efficiency-metric">
                                        {playerState.race.inject_efficiency.map((values, i) => (
                                            values.length > 1 &&
                                                <td
                                                    key={`inject-value-${values[1]}-${i}`}
                                                    className="RaceState__inject-efficiency-value"
                                                >
                                                    {Math.round(values[1] / 22.4, 0)}s
                                                </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>}
                    {playerState.race.creep &&
                        <ul className="RaceState__creep">
                            <li className="RaceState__creep-stat">
                                Creep Coverage
                                <div className="RaceState__zerg-count">
                                    {Math.round(playerState.race.creep.coverage[0] * 100, 0)}%
                                </div>
                            </li>
                            <li className="RaceState__creep-stat">
                                Creep Tiles
                                <div className="RaceState__zerg-count">
                                    {playerState.race.creep.coverage[1]}
                                </div>
                            </li>
                            <li className="RaceState__creep-stat">
                                Active Tumors
                                <div className="RaceState__zerg-count">
                                    {playerState.race.creep.tumors}
                                </div>
                            </li>
                        </ul>}
                </div>
            ))}
        </div>
    );
};

const RaceStateTooltip = ({ payload }) => {
    if (payload.length === 0) {
        return null;
    }

    const tooltipData = [{ resource: 'Minerals', values: [] }, { resource: 'Gas', values: [] }];

    // transposing resource data from player based to resource type based
    Object.values(payload[0].payload).forEach((playerResourceData) => {
        tooltipData[0].values.push(playerResourceData.minerals);
        tooltipData[1].values.push(playerResourceData.gas);
    });

    return (
        <div className="RaceStateTooltip">
            <table>
                <tbody>
                    <tr>
                        <td />
                        <td className="tooltip__player tooltip__player--player1">
                            <svg
                                className="tooltip__player-indicator"
                                height="10"
                                width="10"
                            >
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="5"
                                    fill="hsl(0, 100%, 55%)"
                                />
                            </svg>
                        </td>
                        <td className="tooltip__player tooltip__player--player1">
                            <svg
                                className="tooltip__player-indicator"
                                height="10"
                                width="10"
                            >
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="5"
                                    fill="hsl(240, 80%, 55%)"
                                />
                            </svg>
                        </td>
                    </tr>
                    {tooltipData.map((playerResourceData, i) => (
                        <tr key={`${playerResourceData.resource}-${i}`}>
                            <td className="tooltip__stat-name">
                                {playerResourceData.resource}
                            </td>
                            <td className="tooltip__stat-values">
                                {playerResourceData.values[0]}
                            </td>
                            <td className="tooltip__stat-values">
                                {playerResourceData.values[1]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RaceState;
