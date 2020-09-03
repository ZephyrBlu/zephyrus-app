import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import './Winrate.css';

const Winrate = () => {
    // const selectedRace = useSelector(state => state.selectedRace);
    const currentWinrate = useSelector(state => state.raceData[state.selectedRace].winrate);
    const [formattedData, setFormattedData] = useState(null);

    useEffect(() => {
        if (currentWinrate) {
            const isCurrentSeason = Object.values(currentWinrate).some(matchup => (
                !!matchup.seasons.current
            ));
            
            let season;
            if (isCurrentSeason) {
                season = 'current';
            } else {
                season = 'previous';
            }

            const matchupData = [];
            const rawMapData = {};
            Object.entries(currentWinrate).forEach(([matchupName, values]) => {
                const { maps, ...matchup } = values.seasons[season];
                matchup.matchup = matchupName;
                matchupData.push(matchup);
                Object.entries(maps).forEach(([mapName, mapValues]) => {
                    if (!Object.keys(rawMapData).includes(mapName)) {
                        rawMapData[mapName] = [];
                    }
                    // mapData[mapName][matchupName] = mapValues;
                    mapValues.map = mapName;
                    mapValues.matchup = matchupName;
                    rawMapData[mapName].push(mapValues);
                });
            });
            const mapData = Object.values(rawMapData).map(values => values);

            const mapComparator = (a, b) => {
                let allWinrateA;
                let allWinrateB;
                a.forEach((values) => {
                    if (values.matchup === 'all') {
                        allWinrateA = values.winrate;
                    }
                });
                b.forEach((values) => {
                    if (values.matchup === 'all') {
                        allWinrateB = values.winrate;
                    }
                });

                if (allWinrateA < allWinrateB) {
                    return 1;
                }
                
                if (allWinrateA > allWinrateB) {
                    return -1;
                }
            };

            const dataComparator = (a, b) => {
                // 'all' is highest priority
                if (a.matchup === 'all') {
                    return -1;
                }

                if (b.matchup === 'all') {
                    return 1;
                }

                if (a.winrate < b.winrate) {
                    return 1;
                }
                
                if (a.winrate > b.winrate) {
                    return -1;
                }

                return 0;
            };
            mapData.sort(mapComparator);
            mapData.forEach(map => map.sort(dataComparator));
            matchupData.sort(dataComparator);

            setFormattedData({
                matchups: matchupData,
                maps: mapData,
            });
        }
    }, [currentWinrate]);

    useEffect(() => {
        const bars = [...document.getElementsByClassName('WinrateSummary__value-bar')];
        bars.forEach((bar) => {
            bar.animate([
                { strokeDashoffset: Number(bar.dataset.value) },
                { strokeDashoffset: 0 },
            ], {
                delay: Number(bar.dataset.delay),
                duration: 800,
                easing: 'cubic-bezier(.15, .2, .2, 1)',
                fill: 'forwards',
            });
        });
    }, [formattedData]);

    console.log('HELLO', formattedData);

    const raceColours = {
        all: 'hsl(210, 68%, 47%)',
        protoss: 'hsl(50, 80%, 45%)',
        terran: 'hsl(15, 90%, 40%)',
        zerg: 'hsl(270, 80%, 35%)',
    };

    return (
        <div className="WinrateSummary">
            {formattedData &&
                <Fragment>
                    <div className="WinrateSummary__winrate-data">
                        {formattedData.matchups.map((values, index) => (
                            <div key={`${values.winrate}`} className="WinrateSummary__data-point">
                                <h2 className={`WinrateSummary__value-name`}>
                                    {values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}
                                </h2>
                                <svg
                                    className={`WinrateSummary__value-bar-wrapper WinrateSummary__value-bar-wrapper--${values.matchup}`}
                                    viewBox="0 0 102 3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        data-value={values.winrate + 1}
                                        data-delay={100 + (70 * (index))}
                                        width={values.winrate}
                                        height={3}
                                        fill={raceColours[values.matchup]}
                                        rx={1}
                                        ry={1}
                                        className={`WinrateSummary__value-bar WinrateSummary__value-bar--${values.matchup}`}
                                    />
                                </svg>
                                <h2 className={`WinrateSummary__values`}>
                                    {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                </h2>
                            </div>
                        ))}
                    </div>
                    {formattedData.maps.map((matchupData) => (
                        <div className="WinrateSummary__map">
                            {matchupData.map((values, index) => (
                                <div key={`${values.winrate}`} className="WinrateSummary__data-point">
                                    <h2 className={`WinrateSummary__value-name`}>
                                        {values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}
                                    </h2>
                                    <svg
                                        className={`WinrateSummary__value-bar-wrapper WinrateSummary__value-bar-wrapper--${values.matchup}`}
                                        viewBox="0 0 102 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            data-value={values.winrate + 1}
                                            data-delay={100 + (70 * (index))}
                                            d={`M1,0.5 L${values.winrate + 1},0.5`}
                                            className={`WinrateSummary__value-bar WinrateSummary__value-bar--${values.matchup}`}
                                            stroke={raceColours[values.matchup]}
                                            strokeWidth={0.5}
                                            strokeLinecap="round"
                                            strokeDasharray={values.winrate + 1}
                                            strokeDashoffset={values.winrate + 1}
                                        />
                                    </svg>
                                    <h2 className={`WinrateSummary__values`}>
                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                    </h2>
                                </div>
                            ))}
                        </div>
                    ))}
                </Fragment>}
        </div>
    );
};

export default Winrate;
