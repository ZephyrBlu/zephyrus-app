import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import './Winrate.css';

const Winrate = () => {
    // const selectedRace = useSelector(state => state.selectedRace);
    const currentWinrate = useSelector(state => state.raceData[state.selectedRace].winrate);
    const [formattedData, setFormattedData] = useState(null);

    useEffect(() => {
        if (currentWinrate && !formattedData) {
            const isCurrentSeason = Object.values(currentWinrate).some(matchup => (
                !!matchup.seasons.current
            ));

            let season;
            if (isCurrentSeason) {
                season = 'current';
            } else {
                season = 'previous';
            }

            let overallWinrate;
            const matchupData = [];
            const mapData = [];
            const byMatchupData = [];
            const byMapData = [];
            const rawByMatchupData = {};
            const rawByMapData = {};
            Object.entries(currentWinrate).forEach(([matchupName, values]) => {
                const { maps, ...matchup } = values.seasons[season];
                matchup.map = 'all';
                matchup.matchup = matchupName;

                if (matchupName !== 'all') {
                    matchupData.push(matchup);
                    rawByMatchupData[matchupName] = [matchup];
                } else {
                    overallWinrate = matchup;
                }

                Object.entries(maps).forEach(([mapName, mapValues]) => {
                    if (!Object.keys(rawByMapData).includes(mapName)) {
                        rawByMapData[mapName] = [];
                    }

                    mapValues.map = mapName;
                    mapValues.matchup = matchupName;
                    rawByMapData[mapName].push(mapValues);

                    if (matchupName !== 'all' && mapName !== 'all') {
                        rawByMatchupData[matchupName].push(mapValues);
                    }
                });
            });

            Object.values(rawByMatchupData).forEach((values) => {
                byMatchupData.push(values);
            });

            Object.values(rawByMapData).forEach((values) => {
                byMapData.push(values);
                const currentMapData = {
                    map: values[0].map,
                    matchup: 'all',
                    winrate: null,
                    wins: 0,
                    losses: 0,
                };
                values.forEach((matchup) => {
                    currentMapData.wins += matchup.wins;
                    currentMapData.losses += matchup.losses;
                });
                currentMapData.winrate = Number(((currentMapData.wins / (currentMapData.wins + currentMapData.losses)) * 100).toFixed(1));
                mapData.push(currentMapData);
            });

            const winrateComparator = (a, b) => {
                if (
                    (b.map === 'all' && a.map !== 'all')
                    || (b.matchup === 'all' && a.matchup !== 'all')
                ) {
                    return 1;
                }

                if (
                    (b.map === 'all' && a.map !== 'all')
                    || (a.matchup === 'all' && b.matchup !== 'all')
                ) {
                    return -1;
                }

                if (a.winrate < b.winrate) {
                    return 1;
                }

                if (a.winrate > b.winrate) {
                    return -1;
                }

                return 0;
            };

            const byMatchupComparator = (a, b) => {
                let allWinrateA;
                let allWinrateB;
                a.forEach((values) => {
                    if (values.map === 'all') {
                        allWinrateA = values.winrate;
                    }
                });
                b.forEach((values) => {
                    if (values.map === 'all') {
                        allWinrateB = values.winrate;
                    }
                });

                if (allWinrateA < allWinrateB) {
                    return 1;
                }

                if (allWinrateA > allWinrateB) {
                    return -1;
                }

                return 0;
            };

            const byMapComparator = (a, b) => {
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

                return 0;
            };
            matchupData.sort(winrateComparator);
            mapData.sort(winrateComparator);
            byMatchupData.sort(byMatchupComparator);
            byMatchupData.forEach(map => map.sort(winrateComparator));
            byMapData.sort(byMapComparator);
            byMapData.forEach(map => map.sort(winrateComparator));

            setFormattedData({
                total: { ...overallWinrate },
                matchups: matchupData,
                maps: mapData,
                byMatchup: byMatchupData,
                byMap: byMapData,
            });
        }
    }, [currentWinrate]);

    useEffect(() => {
        const bars = [...document.getElementsByClassName('Winrate__value-bar')];
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

    console.log('RAW', currentWinrate);
    console.log('HELLO', formattedData);

    const raceColours = {
        all: 'hsl(210, 68%, 47%)',
        protoss: 'hsl(50, 80%, 45%)',
        terran: 'hsl(15, 90%, 40%)',
        zerg: 'hsl(270, 80%, 35%)',
    };

    return (
        <div className="Winrate">
            {formattedData &&
                <Fragment>
                    <div className="Winrate__data-container Winrate__data-container--matchup">
                        {formattedData.matchups.map((values, index) => (
                            <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--matchup">
                                <h2 className="Winrate__values-name">
                                    {values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}
                                </h2>
                                <h2 className="Winrate__values">
                                    {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                </h2>
                                <svg
                                    className={`Winrate__value-bar-wrapper Winrate__value-bar-wrapper--${values.matchup}`}
                                    viewBox="0 0 100 3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        data-value={values.winrate}
                                        data-delay={100 + (70 * (index))}
                                        width={values.winrate}
                                        height={3}
                                        fill={raceColours[values.matchup]}
                                        rx={1}
                                        ry={1}
                                        className={`Winrate__value-bar Winrate__value-bar--${values.matchup}`}
                                    />
                                </svg>
                            </div>
                        ))}
                    </div>
                    <div className="Winrate__data-container Winrate__data-container--matchup">
                        {formattedData.maps.map((values, index) => (
                            <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--matchup">
                                <h2 className="Winrate__values-name">
                                    {values.map.charAt(0).toUpperCase() + values.map.slice(1)}
                                </h2>
                                <h2 className="Winrate__values">
                                    {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                </h2>
                                <svg
                                    className={`Winrate__value-bar-wrapper Winrate__value-bar-wrapper--${values.matchup}`}
                                    viewBox="0 0 100 3"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        data-value={values.winrate}
                                        data-delay={100 + (70 * (index))}
                                        width={values.winrate}
                                        height={3}
                                        fill={raceColours[values.matchup]}
                                        rx={1}
                                        ry={1}
                                        className={`Winrate__value-bar Winrate__value-bar--${values.matchup}`}
                                    />
                                </svg>
                            </div>
                        ))}
                    </div>
                    {formattedData.byMap.map(matchupData => (
                        <div className="Winrate__data-container Winrate__data-container--map">
                            {matchupData.map((values, index) => (
                                <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--map">
                                    <h2 className="Winrate__values-name">
                                        {index === 0
                                            ? values.map
                                            : `vs ${values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}`}
                                    </h2>
                                    <h2 className="Winrate__values">
                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                    </h2>
                                    <svg
                                        className={`Winrate__value-bar-wrapper Winrate__value-bar-wrapper--${values.matchup}`}
                                        viewBox="0 0 100.25 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            data-value={values.winrate}
                                            data-delay={100 + (70 * (index))}
                                            d={`M0.25,0.5 L${values.winrate},0.5`}
                                            className={`Winrate__value-bar Winrate__value-bar--${values.matchup}`}
                                            stroke={raceColours[values.matchup]}
                                            strokeWidth={0.5}
                                            strokeLinecap="round"
                                            strokeDasharray={values.winrate}
                                            strokeDashoffset={values.winrate}
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    ))}
                    {formattedData.byMatchup.map(mapData => (
                        <div className="Winrate__data-container Winrate__data-container--map">
                            {mapData.map((values, index) => (
                                <div key={`${values.winrate}`} className="Winrate__values-container Winrate__values-container--map">
                                    <h2 className="Winrate__values-name">
                                        {index === 0
                                            ? `vs ${values.matchup.charAt(0).toUpperCase() + values.matchup.slice(1)}`
                                            : values.map}
                                    </h2>
                                    <h2 className="Winrate__values">
                                        {values.winrate}%<small>({values.wins}/{values.wins + values.losses})</small>
                                    </h2>
                                    <svg
                                        className={`Winrate__value-bar-wrapper Winrate__value-bar-wrapper--${index === 0 ? 'all' : values.matchup}`}
                                        viewBox="0 0 100.25 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            data-value={values.winrate}
                                            data-delay={100 + (70 * (index))}
                                            d={`M0.25,0.5 L${values.winrate},0.5`}
                                            className={`Winrate__value-bar Winrate__value-bar--${index === 0 ? 'all' : values.matchup}`}
                                            stroke={index === 0 ? raceColours.all : raceColours[values.matchup]}
                                            strokeWidth={0.5}
                                            strokeLinecap="round"
                                            strokeDasharray={values.winrate}
                                            strokeDashoffset={values.winrate}
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    ))}
                </Fragment>}
        </div>
    );
};

export default Winrate;
