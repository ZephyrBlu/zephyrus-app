import React, { useState, useEffect } from 'react';
import './CSS/ReplaySummary.css';

const ReplaySummary = ({ replay, timeline }) => {
    const [summaryStats, setSummaryStats] = useState(null);
    const raceWorkers = {
        Protoss: 'Probe',
        Terran: 'SCV',
        Zerg: 'Drone',
    };
    const userId = replay.info.user_match_id;
    const oppId = userId === 1 ? 2 : 1;

    useEffect(() => {
        console.log(replay, timeline);

        const updatedSummaryStats = {
            workersAt6: {
                1: null,
                2: null,
            },
            workersLostAt6: {
                1: null,
                2: null,
            },
            apm: {
                1: replay.info.apm[1],
                2: replay.info.apm[2],
            },
            spm:  {
                1: replay.info.spm[1],
                2: replay.info.spm[2],
            },
            supplyBlocksAt6: {
                1: null,
                2: null,
            },
            sq: {
                1: replay.info.sq[1],
                2: replay.info.sq[2],
            },
            resourcesLost: {
                1: [replay.info.resources_lost_minerals[1], replay.info.resources_lost_gas[1]],
                2: [replay.info.resources_lost_minerals[2], replay.info.resources_lost_gas[2]],
            },
            avgCollectionRate: {
                1: null,
                2: null,
            },
        };

        // const unspentResources = {
        //     1: [],
        //     2: [],
        // };
        const collectionRates = {
            1: [],
            2: [],
        };
        timeline.data.forEach((gameState) => {
            // gameloops/s * 60 * 6min = 6min threshold
            // 22.4 * (60 * 6) = 8064
            // supply block / 5 = number of supply blocks since we count in 5sec intervals
            if (gameState[1].gameloop >= 8064 && !updatedSummaryStats.workersAt6[1]) {
                updatedSummaryStats.workersAt6[1] = gameState[1].unit[raceWorkers[replay.data.players[1].race]].live;
                updatedSummaryStats.workersLostAt6[1] = gameState[1].unit[raceWorkers[replay.data.players[1].race]].died;
                updatedSummaryStats.supplyBlocksAt6[1] = gameState[1].supply_block / 5;

                updatedSummaryStats.workersAt6[2] = gameState[2].unit[raceWorkers[replay.data.players[2].race]].live;
                updatedSummaryStats.workersLostAt6[2] = gameState[2].unit[raceWorkers[replay.data.players[2].race]].died;
                updatedSummaryStats.supplyBlocksAt6[2] = gameState[2].supply_block / 5;
            }
            collectionRates[1].push([
                gameState[1].resource_collection_rate.minerals,
                gameState[1].resource_collection_rate.gas,
            ]);
            collectionRates[2].push([
                gameState[2].resource_collection_rate.minerals,
                gameState[2].resource_collection_rate.gas,
            ]);
        });
        updatedSummaryStats.avgCollectionRate[1] = [];
        updatedSummaryStats.avgCollectionRate[2] = [];

        const p1MineralAvg = Math.round(collectionRates[1].map(collectionRateValues => collectionRateValues[0]).reduce((total, val) => total + val, 0) / collectionRates[1].length);
        const p1GasAvg = Math.round(collectionRates[1].map(collectionRateValues => collectionRateValues[1]).reduce((total, val) => total + val, 0) / collectionRates[1].length);
        updatedSummaryStats.avgCollectionRate[1].push(p1MineralAvg, p1GasAvg);

        const p2MineralAvg = Math.round(collectionRates[2].map(collectionRateValues => collectionRateValues[0]).reduce((total, val) => total + val, 0) / collectionRates[2].length);
        const p2GasAvg = Math.round(collectionRates[2].map(collectionRateValues => collectionRateValues[1]).reduce((total, val) => total + val, 0) / collectionRates[2].length);
        updatedSummaryStats.avgCollectionRate[2].push(p2MineralAvg, p2GasAvg);

        setSummaryStats(updatedSummaryStats);
    }, [timeline.loading]);

    const summaryStatNames = {
        workersAt6: 'Workers Active @6min',
        workersLostAt6: 'Workers Lost @6min',
        apm: 'Actions Per Minute',
        spm: 'Screens Per Minute',
        supplyBlocksAt6: 'Number of Supply Blocks @6min',
        sq: 'Spending Quotient',
        resourcesLost: 'Resources Lost',
        avgCollectionRate: 'Avg Collection Rate',
    };

    const calcStatDiff = (statName, returnType = null) => {
        if (!summaryStats || !summaryStats[statName][1] || !summaryStats[statName][2]) {
            return 'N/A';
        }

        // resource collection rate
        let statDiff;
        if (Array.isArray(summaryStats[statName][1])) {
            const userResourceTotal = summaryStats[statName][userId][0] + summaryStats[statName][userId][1];
            const oppResourceTotal = summaryStats[statName][oppId][0] + summaryStats[statName][oppId][1];
            statDiff = Math.round((1 - (oppResourceTotal / userResourceTotal)) * 100);
        } else {
            // should calculate % from largest number
            // const statValues = [summaryStats[statName][userId], summaryStats[statName][oppId]];
            statDiff = Math.round((1 - (summaryStats[statName][oppId] / summaryStats[statName][userId])) * 100);
        }

        if (returnType === 'bool') {
            return statDiff >= 0;
        }
        return statDiff >= 0 ? `+${statDiff}` : statDiff;
    };

    const splitValues = (statValues) => {
        // every value must be boolean true
        if (!statValues) {
            return '';
        }

        let valueString = '';
        statValues.forEach((val, index) => {
            if (index === 0) {
                valueString += val;
            } else {
                valueString += ` / ${val}`;
            }
        });
        return valueString;
    };

    return (
        <div className="ReplaySummary">
            {summaryStats && Object.keys(summaryStats).map(statName => (
                <div
                    className={`
                        ReplaySummary__summary-stat
                        ReplaySummary__summary-stat--${statName}
                        ReplaySummary__summary-stat--${calcStatDiff(statName, 'bool') ? 'positive' : 'negative'}
                    `}
                >
                    <div className="ReplaySummary__summary-stat-info ReplaySummary__summary-stat-info--name">
                        {summaryStatNames[statName]}
                    </div>
                    <div className="ReplaySummary__summary-stat-info ReplaySummary__summary-stat-info--value">
                    {['avgCollectionRate', 'resourcesLost'].includes(statName)
                        ? splitValues(summaryStats[statName][userId])
                        : summaryStats[statName][userId]}
                    </div>
                    <div className="ReplaySummary__summary-stat-info ReplaySummary__summary-stat-info--diff">
                        {calcStatDiff(statName)}%
                    </div>
                    <div className="ReplaySummary__summary-stat-info ReplaySummary__summary-stat-info--opp-value">
                        (vs {['avgCollectionRate', 'resourcesLost'].includes(statName)
                            ? splitValues(summaryStats[statName][oppId])
                            : summaryStats[statName][oppId]})
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReplaySummary;
