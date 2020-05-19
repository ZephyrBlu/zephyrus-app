import { Fragment } from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import './CSS/RaceState.css';

const RaceState = ({ players, timelineState }) => {
    const raceStatNames = {
        warpgate_efficiency: 'Warp Gate Efficiency',
        energy: 'Energy Efficiency',
        abilities_used: 'Abilities Used',
        inject_efficiency: 'Inject Efficiency',
        creep: 'Creep Coverage',
    };

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

    const formatRaceStatValue = (statName, stat) => {
        switch (statName) {
            case 'abilities_used':
                return Object.entries(stat).map(([s, v]) => (
                    `${abilityNames[s]} ${v}`
                ));

            case 'energy':
                return Object.values(stat).map(buildingType => (
                    buildingType.map(building => `${Math.round(building[1] * 100, 1)}% `)
                ));

            case 'warpgate_efficiency':
                return `${Math.round(stat[0] * 100, 1)}%`;

            case 'creep':
                return `${Math.round(stat.coverage[0] * 100, 1)}% (${stat.tumors})`;

            case 'inject_efficiency':
                return stat.map(s => `${Math.round(s * 100, 1)}% `);

            default:
                return 'NO STAT';
        }
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

    return (
        <div className="RaceState">
            {Object.values(timelineState).map((playerState, index) => (
                <div className={`RaceState__player RaceState__player--player${index + 1}`}>
                    {playerState.race.energy &&
                        <Fragment>
                            <BarChart
                                width={70 + (Object.values(playerState.race.energy)[0].length * 40)}
                                height={100}
                                barGap={10}
                                margin={{ left: 70 }}
                                data={formatEnergyData(playerState.race.energy, index + 1)}
                            >
                                <YAxis type="number" domain={[0, 200]} hide />
                                {playerState.race.energy[energyCommandStructures[players[index + 1].race]].map((building, i) => (
                                    <Bar
                                        dataKey={`building${i}`}
                                        fill="#ffffff"
                                        isAnimationActive={false}
                                        barSize={30}
                                        maxBarSize={20}
                                    />
                                ))}
                            </BarChart>
                            <table className="RaceState__energy">
                                {transposeEnergyData(playerState.race.energy).map(energyMetric => (
                                    <tr className="RaceState__energy-metric">
                                        {energyMetric.map(value => (
                                            <td className="RaceState__energy-metric-value">{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </table>
                        </Fragment>}
                    {playerState.race.inject_efficiency &&
                        <Fragment>
                            <BarChart width={100} height={100} data={formatInjectData(playerState.race.inject_efficiency)}>
                                <YAxis type="number" domain={[0, 1]} hide />
                                {playerState.race.inject_efficiency.map((building, i) => (
                                    <Bar
                                        dataKey={`building${i}`}
                                        fill="#ffffff"
                                        isAnimationActive={false}
                                        maxBarSize={25}
                                    />
                                ))}
                            </BarChart>
                            <table className="RaceState__inject-efficiency">
                                <tr>
                                    {playerState.race.inject_efficiency.map(value => (
                                        <td>{Math.round(value * 100, 0)}%</td>
                                    ))}
                                </tr>
                            </table>
                        </Fragment>}
                </div>
            ))}
        </div>
    );
};

export default RaceState;
