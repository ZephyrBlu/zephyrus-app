import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
            formattedData[`building${index}`] = building;
        });

        return [formattedData];
    };

    const transposeEnergyData = (energyData) => {
        // energy values, energy efficiency, energy idle time
        const formattedData = [['Energy'], ['Efficiency'], ['Idle Time']];

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
                <ResponsiveContainer width="99%" height={44}>
                    <BarChart
                        layout="vertical"
                        barGap={2}
                        barSize={15}
                        maxBarSize={15}
                        data={[formatResourceData(timelineState)[0]]}
                    >
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis type="category" hide />
                        <Bar dataKey="1.mineralsPercent" stackId="minerals" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[10, 0, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="1.gasPercent" stackId="gas" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 0, 10]} isAnimationActive={false} />
                        <Bar dataKey="2.mineralsPercent" stackId="minerals" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 10, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="2.gasPercent" stackId="gas" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 10, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
                <h2 className="RaceState__resource-chart-title">Resources Lost</h2>
                <ResponsiveContainer width="99%" height={44}>
                    <BarChart
                        layout="vertical"
                        barGap={2}
                        barSize={15}
                        maxBarSize={15}
                        data={[formatResourceData(timelineState)[1]]}
                    >
                        <XAxis type="number" domain={[0, 1]} hide />
                        <YAxis type="category" hide />
                        <Bar dataKey="1.mineralsPercent" stackId="minerals" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[10, 0, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="1.gasPercent" stackId="gas" fill="hsla(0, 100%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 0, 10]} isAnimationActive={false} />
                        <Bar dataKey="2.mineralsPercent" stackId="minerals" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 10, 0, 0]} isAnimationActive={false} />
                        <Bar dataKey="2.gasPercent" stackId="gas" fill="hsla(240, 80%, 55%, 0.6)" strokeWidth={resourceBarStrokeWidth} strokeOpacity={resourceBarStrokeOpacity} radius={[0, 0, 10, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {Object.values(timelineState).map((playerState, index) => (
                <div key={`player-state-${index + 1}`} className={`RaceState__player RaceState__player--player${index + 1}`}>
                    {playerState.race.energy &&
                        <div className="RaceState__energy">
                            <BarChart
                                width={70 + (Object.values(playerState.race.energy)[0].length * 35)}
                                height={60}
                                barGap={10}
                                margin={{ left: 70 }}
                                data={formatEnergyData(playerState.race.energy, index + 1)}
                            >
                                <YAxis type="number" domain={[0, 200]} hide />
                                {playerState.race.energy[energyCommandStructures[players[index + 1].race]].map((building, i) => (
                                    <Bar
                                        key={`energy-building-${building}`}
                                        dataKey={`building${i}`}
                                        fill="#ffffff"
                                        isAnimationActive={false}
                                        barSize={25}
                                        maxBarSize={25}
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
                        <div className="RaceState__inject-efficiency">
                            <BarChart width={100} height={100} data={formatInjectData(playerState.race.inject_efficiency)}>
                                <YAxis type="number" domain={[0, 1]} hide />
                                {playerState.race.inject_efficiency.map((building, i) => (
                                    <Bar
                                        key={`inject-building-${building}`}
                                        dataKey={`building${i}`}
                                        fill="#ffffff"
                                        isAnimationActive={false}
                                        maxBarSize={25}
                                    />
                                ))}
                            </BarChart>
                            <table className="RaceState__inject-efficiency-metrics">
                                <tbody>
                                    <tr>
                                        {playerState.race.inject_efficiency.map((value, i) => (
                                            <td key={`inject-value-${value}-${i}`}>{Math.round(value * 100, 0)}%</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>}
                </div>
            ))}
        </div>
    );
};

export default RaceState;
